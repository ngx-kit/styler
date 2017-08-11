import { processAutoPx } from '../process-auto-px';
import { CssBorder, CssBorderProps, CssBorderSmart } from '../../meta/style';
import { isObject } from '../../utils/is-object';
import { isUndefined } from '../../utils/is-undefined';

/**
 * @todo border-top, border-right, border-bottom, border-left
 */

export function compileBorder(rawValue: CssBorder, rawSide: string | null = null): string {
  const side = rawSide ? `-${rawSide}` : '';
  if (Array.isArray(rawValue)) {
    return compileBorderSmartValue(rawValue as CssBorderSmart, side);
  } else if (isObject(rawValue)) {
    return compileBorderPropsValue(rawValue, 'side');
  } else {
    return `border${side}:${rawValue};`;
  }
}
function compileBorderSmartValue(rawValue: CssBorderSmart, side: string): string {
  return `border${side}:${processAutoPx(rawValue[0])} ${rawValue[1]} ${rawValue[2]};`
}
function compileBorderPropsValue(rawValue: CssBorderProps, side: string): string {
  let compiled = '';
  if (!isUndefined(rawValue.color)) {
    compiled += `border${side}-color:${rawValue.color};`;
  }
  if (!isUndefined(rawValue.style)) {
    compiled += `border${side}-style:${rawValue.style};`;
  }
  if (!isUndefined(rawValue.radius)) {
    compiled += `border${side}-radius:${processAutoPx(rawValue.radius)};`;
  }
  if (!isUndefined(rawValue.width)) {
    compiled += `border${side}-width:${processAutoPx(rawValue.width)};`;
  }
  return compiled;
}
