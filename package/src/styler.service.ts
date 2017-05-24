import { Injectable } from '@angular/core';
import { media, style as s } from 'typestyle';

import { StylerState, StylerStateValue } from './interfaces';
import { clone } from './utils';

/**
 * @todo interfaces!!
 * @todo add (!replace) styles on additional registrations (or add upgrade methods)
 * @todo optimize & add cache
 */

@Injectable()
export class StylerService {

  styles: any;
  statesStyles: any = {};
  states: StylerState[] = [];

  register(styles: any): void {
    this.styles = styles;
  }

  registerState(name: string, styles: any, defaultState: StylerStateValue = null): void {
    this.states.push({name, value: defaultState});
    this.statesStyles[name] = styles;
  }

  getHostClass(): string {
    return this.getByName('host');
  }

  getByName(name: string): string {
    if (this.styles[name]) {
      // get base styles
      const base = this.styles[name];
      // merge with state styles
      const compiled = this.states
          .map(s => this.getStateStyles(s.name, s.value))
          .map(styles => (styles && styles[name]) || {})
          .reduce((c, s) => {
            return {...c, ...s};
          }, base);
      // get className (by typestyle)
      return this.transpile(clone(compiled));
    } else {
      throw new Error(`Styler: component does not have "${name}" property!`);
    }
  }

  getStateStyles(name: string, value: StylerStateValue): any {
    if (value !== null) {
      if (this.statesStyles[name]) {
        return this.statesStyles[name][value] || {};
      } else {
        throw new Error(`Styler: styles for state "${name}" not registered!`);
      }
    }
  }

  setState(name: string, value: StylerStateValue): void {
    const state = this.states.find(s => s.name === name);
    if (state) {
      state.value = value;
    } else {
      throw new Error(`Styler: state "${name} not registered!`);
    }
  }

  private transpile(compiled: any): string {
    // media
    const $media: any[] = compiled['$media'] || [];
    delete(compiled['$media']);
    // generate className
    return s(
        compiled,
        ...$media.map(rule => media(rule[0], rule[1])),
    );
  }

}
