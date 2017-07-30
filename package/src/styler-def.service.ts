import { Injectable } from '@angular/core';
import { PickStyleDef, StyleDef, WrappedStyleDef } from './meta/def';
import { isFunction } from './utils/is-function';
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
      return this.unwrap(styles[state]);
    } else if (def !== null) {
      return this.unwrap(styles[def]);
    } else {
      return {};
    }
  }

  toggle(state: boolean, styles: StyleDef, falseStyles?: StyleDef): StyleDef {
    return state
        ? this.unwrap(styles)
        : this.unwrap(falseStyles || {});
  }

  unwrap(raw: StyleDef | WrappedStyleDef): StyleDef {
    if (isFunction(raw)) {
      return raw();
    } else {
      return raw;
    }
  }
}
