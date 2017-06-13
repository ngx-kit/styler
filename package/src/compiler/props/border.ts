import { CssBorder, CssBorderProps, CssBorderSmart } from '../../meta/style';
import { isObject } from '../../utils/is-object';
import { processAutoPx } from '../../helpers/process-auto-px';
import { isUndefined } from '../../utils/is-undefined';

export function compileBorder(rawValue: CssBorder): string {
  if (Array.isArray(rawValue)) {
    return compileBorderSmartValue(rawValue as CssBorderSmart);
  } else if (isObject(rawValue)) {
    return compileBorderPropsValue(rawValue);
  } else {
    return `border:${rawValue};`;
  }
}

function compileBorderSmartValue(rawValue: CssBorderSmart): string {
  return `border:${processAutoPx(rawValue[0])} ${rawValue[1]} ${rawValue[2]};`
}

function compileBorderPropsValue(rawValue: CssBorderProps): string {
  let compiled = '';
  if (!isUndefined(rawValue.color)) {
    compiled += `border-color:${rawValue.color};`;
  }
  if (!isUndefined(rawValue.style)) {
    compiled += `border-style:${rawValue.style};`;
  }
  if (!isUndefined(rawValue.radius)) {
    compiled += `border-radius:${processAutoPx(rawValue.radius)};`;
  }
  if (!isUndefined(rawValue.width)) {
    compiled += `border-width:${processAutoPx(rawValue.width)};`;
  }
  return compiled;
}
