import { Inject, Injectable, OnDestroy, Optional, Self } from '@angular/core';

import { StylerElement } from './styler-element';
import { StylerCompilerService } from './compiler/compiler.service';
import { componentStyle } from './meta/tokens';
import { ComponentStyle } from './meta/component';
import { StylerCompilerUnit } from './compiler/compiler-unit';

/**
 * @todo optimize & add cache
 * @todo logger (debugger)
 * @todo units register
 */
@Injectable()
export class StylerComponent implements OnDestroy {

  style: ComponentStyle;
  elements: StylerElement[] = [];

  constructor(private compiler: StylerCompilerService,
              @Self() @Optional() @Inject(componentStyle) private componentStyle: ComponentStyle) {
    if (this.componentStyle) {
      this.register(this.componentStyle);
    }
  }

  ngOnDestroy() {
    this.elements.forEach(element => {
      element.destroy();
    });
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

  get host(): StylerElement {
    let hostElement = this.elements.find(e => e.name === 'host');
    if (!hostElement) {
      hostElement = this.createElement('host');
    }
    return hostElement;
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

  render(unit: StylerCompilerUnit, source?: string): void {
    this.compiler.render(unit, source);
  }

  destroyUnit(unit: StylerCompilerUnit): void {
    this.compiler.destroyUnit(unit);
  }

}
