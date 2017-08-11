import { parseToRgb } from './parse-to-rgb';
import { toColorString } from './to-color-string';

/**
 * Inverts the red, green and blue values of a color.
 *
 * @example
 * background: invert('#CCCD64'),
 * background: invert('rgba(101,100,205,0.7)'),
 */
export function invert(color: string): string {
  // parse color string to rgb
  const value = parseToRgb(color);
  return toColorString({
    ...value,
    red: 255 - value.red,
    green: 255 - value.green,
    blue: 255 - value.blue,
  });
}
