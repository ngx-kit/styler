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
import { ComponentStyle } from './meta/component';
import { componentClassPrefix, componentStyle, elementDef, elementName } from './meta/tokens';
import { StylerElement } from './styler-element';
import { StylerService } from './styler.service';

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

  style: ComponentStyle;

  private hostClasses = new Set<string>();

  private hostSid: string;

  constructor(@Self() @Optional() @Inject(componentStyle) private componentStyle: ComponentStyle,
              private el: ElementRef,
              private renderer: Renderer2,
              private stylerService: StylerService,
              private injector: Injector) {
    this.stylerService.registerComponent(this);
    if (this.componentStyle) {
      this.register(this.componentStyle);
      // create host element if defined
      if (this.componentStyle['host']) {
        this.createHostElement();
      }
    }
  }

  get host(): StylerElement {
    let hostElement = this.elements.find(e => e.name === 'host');
    if (!hostElement) {
      return this.createHostElement();
    }
    return hostElement;
  }

  ngOnDestroy() {
    this.stylerService.unregisterComponent(this);
  }

  createElement(name: string): StylerElement {
    if (!this.style[name]) {
      throw new Error(`Styler: element with name "${name}" is not defined!`);
    }
    // bind style to def function if needed
    const def = typeof this.style[name] === 'function'
        ? this.style[name].bind(this.style)
        : this.style[name];
    // create element
    const injector = ReflectiveInjector.resolveAndCreate([
      StylerElement,
      {
        provide: componentClassPrefix,
        useValue: this.classPrefix,
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

  register(style: ComponentStyle): void {
    if (this.style) {
      throw new Error('Styler: Component style already registered!');
    }
    this.style = style;
    // create host if needed
    if (this.style['host'] && !this.elements.find(e => e.name === 'host')) {
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
    host.sid$.subscribe(sid => {
      this.setHostSid(sid);
    });
    host.classes$.subscribe(classes => {
      this.setElClasses(this.el.nativeElement, this.hostClasses, classes);
      this.hostClasses = new Set(classes);
    });
    return host;
  }

  private setHostSid(sid: string) {
    // @todo check prev hostSid
    if (this.hostSid !== sid) {
      // remove prev
      this.renderer.removeAttribute(this.el.nativeElement, this.hostSid);
      // add new
      this.hostSid = sid;
      this.renderer.setAttribute(this.el.nativeElement, this.hostSid, '');
    }
  }
}
