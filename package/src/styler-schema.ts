import { ElementDef, RegistrationDef, StateDef } from './meta/def';
import { Style } from './meta/style';
import { ElementSchema, StateSchema } from './meta/schema';
import { StateSetter } from './meta/state';

export class StylerSchema {

  elements: ElementSchema[] = [];

  constructor() {
  }

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
      state.defaultValue = def.$default || null;
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
      state.defaultValue = false;
    }
  }

  hasState(elementName: string, name: string): boolean {
    const element = this.getElement(elementName);
    return !!element.states.find(s => s.name === name);
  }

  getDefaultStates(elementName: string): StateSetter {
    const element = this.getElement(elementName);
    return element.states.reduce((prev, curr) => {
      prev[curr.name] = curr.defaultValue;
      return prev;
    }, {});
  }

  compile(elementName: string, state: StateSetter): Style {
    const element = this.getElement(elementName);
    const base = element.style;
    // merge with state styles
    return element.states
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
  }

  /**
   * Find or create element in store.
   *
   * @param name
   * @returns {any}
   */
  private ensureElement(name: string): ElementSchema {
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
   * Find or create for state in store.
   */
  private ensureState(elementName: string, name: string): StateSchema {
    const element = this.getElement(elementName);
    const state = element.states.find(s => s.name === name);
    if (state) {
      return state;
    } else {
      const newState = {
        name,
        values: [],
        defaultValue: null,
      };
      element.states.push(newState);
      return newState;
    }
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

  private getElement(elementName: string): ElementSchema {
    const element = this.elements.find(e => e.name === elementName);
    if (element) {
      return element;
    } else {
      throw new Error(`Styler: element "${elementName}" not registered!`);
    }
  }

}