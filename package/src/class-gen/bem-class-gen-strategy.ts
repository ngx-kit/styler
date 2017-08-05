import { Injectable } from '@angular/core';
import { StateSetter } from '../meta/state';
import { isString } from '../utils/is-string';
import { ClassGenStategy } from './class-gen-stategy';

@Injectable()
export class BemClassGenStrategy extends ClassGenStategy {
  gen(classPrefix: string, elementName: string, state: StateSetter): Set<string> {
    const base = elementName === 'host' ?
        classPrefix
        : `${classPrefix}__${elementName}`;
    return new Set([
      base,
      ...Object.keys(state)
          .filter(name => state[name])
          .map(name => {
            if (isString(state[name])) {
              return `${base}_${name}_${state[name]}`;
            } else {
              return `${base}_${name}`;
            }
          }),
    ]);
  }
}
