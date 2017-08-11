import { RgbColor } from '../../meta/color';
import { numberToHex } from './number-to-hex';
import { reduceHexValue } from './reduce-hex-value';

/**
 * Returns a string value for the color. The returned result is the smallest possible hex notation.
 *
 * @example
 * background: rgb(255, 205, 100)
 * background: rgb({ red: 255, green: 205, blue: 100 })
 */
export function rgb(value: RgbColor | number, green?: number, blue?: number): string {
  if (typeof value === 'number' && typeof green === 'number' && typeof blue === 'number') {
    return reduceHexValue(`#${numberToHex(value)}${numberToHex(green)}${numberToHex(blue)}`);
  } else if (typeof value === 'object' && green === undefined && blue === undefined) {
    return reduceHexValue(`#${numberToHex(value.red)}${numberToHex(value.green)}${numberToHex(value.blue)}`);
  }
  throw new Error(`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object 
  e.g. rgb({ red: 255, green: 205, blue: 100 }).`);
}
