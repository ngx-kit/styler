import { StyleDef, WrappedStyleDef } from '../../meta/def';
import { isFunction } from '../is-function';

export function defUnwrap(raw: StyleDef | WrappedStyleDef): StyleDef {
  return isFunction(raw)
      ? raw()
      : raw;
}
