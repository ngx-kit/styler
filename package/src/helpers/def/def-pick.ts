import { PickStyleDef, StyleDef } from '../../meta/def';
import { defUnwrap } from './def-unwrap';

export function defPick(state: string, styles: PickStyleDef, def: string | null = null): StyleDef {
  return state
      ? defUnwrap(styles[state])
      : def !== null
          ? defUnwrap(styles[def])
          : {};
}
