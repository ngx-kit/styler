import { isString } from '../utils/is-string';

export const autoPx = [
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'bottom',
  'height',
  'left',
  'line-height',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'right',
  'top',
  'width',
];
export function processAutoPx(rawValue: string | number) {
  return isString(rawValue)
      ? rawValue
      : `${rawValue}px`;
}
