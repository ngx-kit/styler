import { Injectable } from '@angular/core';
import { media, style as s } from 'typestyle';

import { Element, RegistrationDef, State, ElementDef, StateDef, StateSetter, Style } from './interfaces';
import { isDefined } from '@angular/compiler/src/util';

/**
 * @todo interfaces!!
 * @todo add (!replace) styles on additional registrations (or add upgrade methods)
 * @todo optimize & add cache
 * @todo logger (debugger)
 */

@Injectable()
export class StylerService {

  elements: Element[] = [];

  register(def: RegistrationDef): void {
    for (const elementName in def) {
      this.registerElement(elementName, def[elementName]);
    }
//    console.log('reg def', def, this.elements);
  }

  registerElement(name: string, def: ElementDef): void {
    const element = this.ensureElement(name);
    // overwrite style
    element.style = {...element.style, ...this.getElementDefStyle(def)};
    // reg states
    if (def.$states) {
      for (const stateName in def.$states) {
        this.registerState(name, stateName, def.$states[stateName]);
      }
    }
  }

  registerState(elementName: string, name: string, def: StateDef): void {
    const state = this.ensureState(elementName, name);
    // overwrite values and styles
    const valuesDef = this.getStateDefValues(def);
    for (const value in valuesDef) {
      const existStyle = state.values.find(v => v.value === value);
      if (existStyle) {
        existStyle.style = {...existStyle.style, ...valuesDef[value]};
      } else {
        state.values.push({
          value,
          style: valuesDef[value],
        });
      }
    }
    // @todo check value definition
    state.currentValue = def.$default || null;
  }

  getHostClass(): string {
    return this.getClass('host');
  }

  getClass(elementName: string): string {
    const element = this.elements.find(e => e.name === elementName);
    if (element) {
      const base = element.style;
      // merge with state styles
      const merged = element.states
          .filter(s => s.currentValue)
          .map(s => {
            const value = s.values.find(v => v.value === s.currentValue);
            return value
                ? value.style
                : {};
          })
          .reduce((c, s) => {
            return {...c, ...s};
          }, base);
//      console.log('lets trnslp', elementName, base, merged);
      // get className (by typestyle)
      return this.transpile(merged);
    } else {
      throw new Error(`Styler::getClass: element "${elementName} not registered!"`);
    }
  }

  setState(elementName: string, setter: StateSetter): void {
    const element = this.elements.find(e => e.name === elementName);
    if (element) {
      for (const stateName in setter) {
        const state = element.states.find(s => s.name === stateName);
        if (state) {
          state.currentValue = setter[stateName];
        } else {
          throw new Error(`Styler::setState: state "${stateName}" for element "${elementName}" not registered!`);
        }
      }
    } else {
      throw new Error(`Styler::setState: element "${elementName}" not registered!`);
    }
  }

  /**
   * Find or create element in store.
   *
   * @param name
   * @returns {any}
   */
  private ensureElement(name: string): Element {
    const element = this.elements.find(e => e.name === name);
    if (element) {
      return element;
    } else {
      const newElement = {
        name,
        style: {},
        states: [],
      };
      this.elements.push(newElement);
      return newElement;
    }
  }

  /**
   * Find or create for element in store.
   */
  private ensureState(elementName: string, name: string): State {
    const element = this.elements.find(e => e.name === elementName);
    if (element) {
      const state = element.states.find(s => s.name === name);
      if (state) {
        return state;
      } else {
        const newState = {
          name,
          values: [],
          currentValue: null,
        };
        element.states.push(newState);
        return newState;
      }
    } else {
      throw new Error(`Styler: Element "${elementName}" not registered!`);
    }
  }

  private transpile(style: Style): string {
    // media
    // @todo move media to states?!
    const $media: any[] = style.$media || [];
    // generate className
    return s(
        this.objectFilter(style, ['$media']),
        ...$media.map(rule => media(rule[0], rule[1])),
    );
  }

  private getElementDefStyle(def: ElementDef): Style {
    return this.objectFilter(def, ['$states']);
  }

  private getStateDefValues(def: StateDef): Style {
    return this.objectFilter(def, ['$default']);
  }

  private objectFilter(raw: any, filter: string[]): any {
    return Object.keys(raw)
        .filter(key => !filter.includes(key))
        .reduce((obj, key) => {
          obj[key] = raw[key];
          return obj;
        }, {});
  }

}
