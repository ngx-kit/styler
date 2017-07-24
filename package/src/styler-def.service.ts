import { Injectable } from '@angular/core';
import { PickStyleDef, StyleDef } from './meta/def';
import { mergeDeepAll } from './utils/merge-deep';

@Injectable()
export class StylerDefService {
  constructor() {
  }

  merge(chunks: StyleDef[]): StyleDef {
    return mergeDeepAll(chunks);
  }

  pick(state: string, styles: PickStyleDef, def: string | null = null): StyleDef {
    if (state) {
      return styles[state];
    } else if (def !== null) {
      return styles[def];
    } else {
      return {};
    }
  }

  toggle(state: boolean, styles: StyleDef, falseStyles?: StyleDef): StyleDef {
    return state
        ? styles
        : falseStyles || {};
  }
}
