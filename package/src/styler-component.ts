import {
  ElementRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  Optional,
  ReflectiveInjector,
  Renderer2,
  Self,
} from '@angular/core';
import 'rxjs/add/observable/combineLatest';
import { CompilerService } from './compiler/compiler.service';
import { ComponentStyle } from './meta/component';
import { StateSetter } from './meta/state';
import { componentClassPrefix, componentStyle, elementDef, elementName } from './meta/tokens';
import { StylerElement } from './styler-element';
import { StylerDirective } from './styler.directive';
import { StylerService } from './styler.service';
import { isArray } from './utils/is-array';
import { isFunction } from './utils/is-function';

/**
 * @todo optimize & add cache
 * @todo logger (debugger)
 * @todo units register
 */
@Injectable()
export class StylerComponent implements OnDestroy {
  /**
   * Class prefix used for native css styling by user.
   * Is prefix is set, styler elements attach class based on prefix, elementName and state.
   */
  classPrefix: string;

  elements: StylerElement[] = [];

  style: ComponentStyle[];

  /**
   * Component state, some sort of a global state.
   */
  private _state: StateSetter = {};

  private hostClasses = new Set<string>();

  private hostSid: string;

  private stateSize = 0;

  constructor(@Self() @Optional() @Inject(componentStyle) componentStyle: ComponentStyle | ComponentStyle[],
              private el: ElementRef,
              private renderer: Renderer2,
              private stylerService: StylerService,
              private injector: Injector,
              private compiler: CompilerService,
              @Self() @Optional() private stylerDirective: StylerDirective) {
    this.stylerService.registerComponent(this);
    if (componentStyle) {
      this.register(componentStyle);
    }
  }

  get host(): StylerElement {
    let hostElement = this.elements.find(e => e.name === 'host');
    if (!hostElement) {
      return this.createHostElement();
    }
    return hostElement;
  }

  get state() {
    return this._state;
  }

  set state(setterRaw: StateSetter) {
    const setter = setterRaw || {};
    if (this.isChanged(setter)) {
      this._state = {...setter};
      this.update();
    }
  }

  ngOnDestroy() {
    this.stylerService.unregisterComponent(this);
  }

  applyState(setter: StateSetter): void {
    const newState = {...this._state, ...setter};
    if (this.isChanged(newState)) {
      this._state = newState;
      this.update();
    }
  }

  createElement(name: string): StylerElement {
    if (this.getStyle(name).length === 0) {
      // @todo console.warning?
      throw new Error(`Styler: element with name "${name}" is not defined!`);
    }
    // bind style to def function if needed
    const def = this.style
        .filter(s => s[name])
        .map(s => {
          return isFunction(s[name])
              ? s[name].bind(s)
              : s[name];
        });
    // create element
    const injector = ReflectiveInjector.resolveAndCreate([
      StylerElement,
      {
        provide: componentClassPrefix,
        useValue: this.classPrefix,
      },
      {
        provide: StylerComponent,
        useValue: this,
      },
      {
        provide: elementName,
        useValue: name,
      },
      {
        provide: elementDef,
        useValue: def,
      },
    ], this.injector);
    const element = injector.get(StylerElement) as StylerElement;
    this.elements.push(element);
    return element;
  }

  getStyle(name: string) {
    return this.style
        .filter(s => s[name])
        .map(s => s[name]);
  }

  /**
   * Proxy to stylerService.
   * Part of API (do not delete).
   *
   * @param def
   * @returns {string}
   */
  keyframes(def: any): string {
    return this.stylerService.keyframes(def);
  }

  register(style: ComponentStyle | ComponentStyle[]): void {
    if (this.style) {
      throw new Error('Styler: Component style already registered!');
    }
    this.style = isArray(style) ? style : [style];
    // create host if needed
    if (this.getStyle('host').length > 0 && !this.elements.find(e => e.name === 'host')) {
      this.createHostElement();
    }
    // update elements
    this.elements.forEach(element => {
      element.update();
    });
  }

  setElClasses(el: Element, prevClasses: Set<string>, currClasses: Set<string>) {
    // remove classes
    Array
        .from(prevClasses)
        .filter(c => !currClasses.has(c))
        .forEach(classToRemove => {
          this.renderer.removeClass(el, classToRemove);
        });
    // add classes
    Array
        .from(currClasses)
        .filter(c => !prevClasses.has(c))
        .forEach(classToAdd => {
          this.renderer.addClass(el, classToAdd);
        });
  }

  update() {
    this.elements.forEach(element => {
      element.update();
    });
  }

  private createHostElement(): StylerElement {
    const host = this.createElement('host');
    if (this.stylerDirective) {
      // push host def to directive
      this.stylerDirective.registerHostDef(host.def$);
    } else {
      // default host styling
      host.def$.subscribe(dif => {
        this.setHostSid(this.compiler.renderElement(dif));
      });
    }
    host.classes$.subscribe(classes => {
      this.setElClasses(this.el.nativeElement, this.hostClasses, classes);
      this.hostClasses = new Set(classes);
    });
    return host;
  }

  private isChanged(newState: StateSetter): boolean {
    if (Object.keys(newState).length === this.stateSize) {
      for (const name in newState) {
        if (newState[name] !== this._state[name]) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  private setHostSid(sid: string) {
    // @todo check prev hostSid
    if (this.hostSid !== sid) {
      // remove prev
      this.renderer.removeClass(this.el.nativeElement, this.hostSid);
      // add new
      this.hostSid = sid;
      this.renderer.addClass(this.el.nativeElement, this.hostSid);
    }
  }
}
