import { ElementRef, Inject, Injectable, OnDestroy, Optional, Renderer2, Self } from '@angular/core';
import { StylerCompilerUnit } from './compiler/compiler-unit';
import { StylerCompilerService } from './compiler/compiler.service';
import { ComponentStyle } from './meta/component';
import { componentStyle } from './meta/tokens';
import { StylerElement } from './styler-element';

/**
 * @todo optimize & add cache
 * @todo logger (debugger)
 * @todo units register
 */
@Injectable()
export class StylerComponent implements OnDestroy {
  elements: StylerElement[] = [];

  style: ComponentStyle;

  private _hostSid: string;

  constructor(private compiler: StylerCompilerService,
              @Self() @Optional() @Inject(componentStyle) private componentStyle: ComponentStyle,
              private el: ElementRef,
              private renderer: Renderer2) {
    if (this.componentStyle) {
      this.register(this.componentStyle);
      // create host element if defined
      if (this.componentStyle['host']) {
        this.createElement('host');
      }
    }
  }

  get host(): StylerElement {
    let hostElement = this.elements.find(e => e.name === 'host');
    if (!hostElement) {
      hostElement = this.createElement('host');
    }
    return hostElement;
  }

  ngOnDestroy() {
    this.elements.forEach(element => {
      element.destroy();
    });
  }

  createElement(elementName: string): StylerElement {
    if (!this.style[elementName]) {
      throw new Error(`Styler: element with name "${elementName}" is not defined!`);
    }
    const compilerUnit = this.compiler.create();
    // bind style to def function if needed
    const def = typeof this.style[elementName] === 'function'
        ? this.style[elementName].bind(this.style)
        : this.style[elementName];
    // create element
    const element = new StylerElement(this, def, compilerUnit, elementName);
    this.elements.push(element);
    return element;
  }

  destroyUnit(unit: StylerCompilerUnit): void {
    this.compiler.destroyUnit(unit);
  }

  register(style: ComponentStyle): void {
    if (this.style) {
      throw new Error('Styler: Component style already registered!');
    }
    this.style = style;
    this.elements.forEach(element => {
      element.update();
    });
  }

  render(unit: StylerCompilerUnit, source?: string): void {
    this.compiler.render(unit, source);
  }

  set hostSid(sid: string) {
    // @todo check prev hostSid
    // remove prev
    this.renderer.removeAttribute(this.el.nativeElement, `host-sid-${this._hostSid}`);
    // add new
    this._hostSid = sid;
    this.renderer.setAttribute(this.el.nativeElement, `host-sid-${this._hostSid}`, '');
  }
}
