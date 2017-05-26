import { Injectable } from '@angular/core';
import { media, style as s } from 'typestyle';

import { Element, RegistrationDef, State, ElementDef, StateDef, StateSetter, Style } from './interfaces';
import { StylerUnit } from './styler_unit';

/**
 * @todo optimize & add cache
 * @todo logger (debugger)
 * @todo units register
 */

@Injectable()
export class StylerService {

  elements: Element[] = [];

  private hostUnit: StylerUnit;

  register(def: RegistrationDef): void {
    for (const elementName in def) {
      this.registerElement(elementName, def[elementName]);
    }
  }

  registerElement(name: string, def: ElementDef): void {
    const element = this.ensureElement(name);
    // overwrite style
    element.style = {...element.style, ...this.getElementDefStyle(def)};
    // reg states
    if (def.$states) {
      for (const stateName in def.$states) {
        this.registerState(name, stateName, def.$states[stateName] as StateDef);
      }
    }
  }

  registerState(elementName: string, name: string, rawDef: StateDef): void {
    const state = this.ensureState(elementName, name);
    // overwrite values and styles
    if (Array.isArray(rawDef)) {
      // multi state definition
      const def = rawDef[0];
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
    } else {
      // single state definition
      const existStyle = state.values.find(v => v.value === true);
      if (existStyle) {
        existStyle.style = {...existStyle.style, ...rawDef};
      } else {
        state.values.push({
          value: true,
          style: rawDef,
        });
      }
      state.currentValue = false;
    }
  }

  getClass(elementName: string, state: StateSetter): string {
    const element = this.getElement(elementName);
    const base = element.style;
    // merge with state styles
    const merged = element.states
        .map(s => {
          const current = state[s.name];
          if (current) {
            const value = s.values.find(v => v.value === current);
            return value
                ? value.style
                : {};
          } else {
            return {};
          }
        })
        .reduce((c, s) => {
          return {...c, ...s};
        }, base);
    // get className (by typestyle)
    return this.transpile(merged);
  }

  getHostClass(): string {
    const hostUnit = this.getHostUnit();
    return hostUnit.getClass();
  }

  getHostUnit(): StylerUnit {
    if (!this.hostUnit) {
      this.hostUnit = this.createUnit('host');
    }
    return this.hostUnit;
  }

//  setState(elementName: string, setter: StateSetter): void {
//    const element = this.getElement(elementName);
//    for (const stateName in setter) {
//      const state = element.states.find(s => s.name === stateName);
//      if (state) {
//        state.currentValue = setter[stateName];
//      } else {
//        throw new Error(`Styler::setState: state "${stateName}" for element "${elementName}" not registered!`);
//      }
//    }
//  }

  hasState(elementName: string, name: string): boolean {
    const element = this.getElement(elementName);
    return !!element.states.find(s => s.name === name);
  }

  createUnit(elementName: string) {
    // @todo validate elementName
    const unit = new StylerUnit(this, elementName);
    unit.setState(this.getDefaultStates(elementName));
    return unit;
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
    const element = this.getElement(elementName);
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

  private getDefaultStates(elementName: string): StateSetter {
    const element = this.getElement(elementName);
    return element.states.reduce((prev, curr) => {
      prev[curr.name] = curr.currentValue;
      return prev;
    }, {});
  }

  private getElement(elementName: string): Element {
    const element = this.elements.find(e => e.name === elementName);
    if (element) {
      return element;
    } else {
      throw new Error(`Styler: element "${elementName}" not registered!`);
    }
  }

}