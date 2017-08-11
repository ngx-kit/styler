import { StyleDef } from '../../meta/def';
import { defUnwrap } from './def-unwrap';

export function defToggle(state: boolean, styles: StyleDef, falseStyles?: StyleDef): StyleDef {
  return state
      ? defUnwrap(styles)
      : defUnwrap(falseStyles || {});
}
