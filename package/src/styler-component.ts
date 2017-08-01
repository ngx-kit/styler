import { ElementRef, Inject, Injectable, OnDestroy, Optional, Renderer2, Self } from '@angular/core';
import { StylerCompilerService } from './compiler/compiler.service';
import { ComponentStyle } from './meta/component';
import { StyleDef } from './meta/def';
import { componentStyle } from './meta/tokens';
import { StylerElement } from './styler-element';
import { StylerService } from './styler.service';

/**
 * @todo optimize & add cache
 * @todo logger (debugger)
 * @todo units register
 */
@Injectable()
export class StylerComponent implements OnDestroy {
  elements: StylerElement[] = [];

  style: ComponentStyle;

  private hostSid: string;

  constructor(private compiler: StylerCompilerService,
              @Self() @Optional() @Inject(componentStyle) private componentStyle: ComponentStyle,
              private el: ElementRef,
              private renderer: Renderer2,
              private stylerService: StylerService) {
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

  createElement(elementName: string): StylerElement {
    if (!this.style[elementName]) {
      throw new Error(`Styler: element with name "${elementName}" is not defined!`);
    }
    // bind style to def function if needed
    const def = typeof this.style[elementName] === 'function'
        ? this.style[elementName].bind(this.style)
        : this.style[elementName];
    // create element
    const element = new StylerElement(this, def, elementName);
    this.elements.push(element);
    return element;
  }

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

  renderElement(def: StyleDef): string {
    return this.compiler.renderElement(def);
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
