import { isString } from '../utils/is-string';

export function processAutoPx(rawValue: string | number) {
  return isString(rawValue)
      ? rawValue
      : `${rawValue}px`;
}
