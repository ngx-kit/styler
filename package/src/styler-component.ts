import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';

import { StylerElement } from './styler-element';
import { RegistrationDef } from './meta/def';
import { StylerCompilerService } from './compiler/compiler.service';
import { StylerSchema } from './styler-schema';
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

  schema: StylerSchema;
  elements: StylerElement[] = [];

  constructor(private compiler: StylerCompilerService,
              @Optional() @Inject(componentStyle) private componentStyle: ComponentStyle) {
    this.schema = new StylerSchema();
    if (this.componentStyle) {
      this.register(this.componentStyle.getStyles());
    }
  }

  ngOnDestroy() {
    this.elements.forEach(element => {
      element.destroy();
    });
  }

  register(def: RegistrationDef): void {
    this.schema.register(def);
  }

  get host(): StylerElement {
    let hostElement = this.elements.find(e => e.name === 'host');
    if (!hostElement) {
      hostElement = this.createElement('host');
    }
    return hostElement;
  }

  createElement(elementName: string): StylerElement {
    // @todo validate elementName
    const compilerUnit = this.compiler.create();
    const element = new StylerElement(this, this.schema, compilerUnit, elementName);
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
