import { processAutoPx } from '../../helpers/process-auto-px';
import { CssMargin, CssMarginProps, CssMarginSmart } from '../../meta/style';
import { isObject } from '../../utils/is-object';
import { isUndefined } from '../../utils/is-undefined';

export function compileMargin(rawValue: CssMargin): string {
  if (Array.isArray(rawValue)) {
    return compileMarginSmartValue(rawValue as CssMarginSmart);
  } else if (isObject(rawValue)) {
    return compileMarginPropsValue(rawValue as CssMarginProps);
  } else {
    return `margin:${processAutoPx(rawValue)};`;
  }
}
function compileMarginSmartValue(rawValue: CssMarginSmart): string {
  return `margin:${rawValue.map(processAutoPx).join(' ')};`;
}
function compileMarginPropsValue(rawValue: CssMarginProps): string {
  let compiled = '';
  if (!isUndefined(rawValue.bottom)) {
    compiled += `margin-bottom:${processAutoPx(rawValue.bottom)};`;
  }
  if (!isUndefined(rawValue.left)) {
    compiled += `margin-left:${processAutoPx(rawValue.left)};`;
  }
  if (!isUndefined(rawValue.top)) {
    compiled += `margin-top:${processAutoPx(rawValue.top)};`;
  }
  if (!isUndefined(rawValue.right)) {
    compiled += `margin-right:${processAutoPx(rawValue.right)};`;
  }
  return compiled;
}
