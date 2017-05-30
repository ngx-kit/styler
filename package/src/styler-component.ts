import { Injectable } from '@angular/core';

import { StylerElement } from './styler-element';
import { RegistrationDef } from './meta/def';
import { StylerCompilerService } from './compiler/compiler.service';
import { StylerSchema } from './styler-schema';

/**
 * @todo optimize & add cache
 * @todo logger (debugger)
 * @todo units register
 */
@Injectable()
export class StylerComponent {

  schema: StylerSchema;
  elements: StylerElement[] = [];

  constructor(private compiler: StylerCompilerService) {
    this.schema = new StylerSchema();
  }

  register(def: RegistrationDef): void {
    this.schema.register(def);
  }

  get host(): StylerElement {
    let hostElement = this.elements.find(e => e.name === 'host');
    if (!hostElement) {
      console.log('Create host');
      hostElement = this.createElement('host');
    }
    return hostElement;
  }

  createElement(elementName: string) {
    // @todo validate elementName
    const compilerUnit = this.compiler.create();
    const element = new StylerElement(this.schema, compilerUnit, elementName);
    this.elements.push(element);
    return element;
  }

  destroy() {
    this.elements.forEach(element => {
      element.destroy();
    });
  }

  render() {
    this.compiler.render();
  }

}