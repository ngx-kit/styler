import { HslColor } from '../../meta/color';
import { hslToHex } from './hsl-to-hex';

/**
 * Returns a string value for the color. The returned result is the smallest possible hex notation.
 *
 * @example
 * background: hsl(359, 0.75, 0.4)
 * background: hsl({ hue: 360, saturation: 0.75, lightness: 0.4 })
 */
export function hsl(value: HslColor | number, saturation?: number, lightness?: number): string {
  if (typeof value === 'number' && typeof saturation === 'number' && typeof lightness === 'number') {
    return hslToHex(value, saturation, lightness);
  } else if (typeof value === 'object' && saturation === undefined && lightness === undefined) {
    return hslToHex(value.hue, value.saturation, value.lightness);
  }
  throw new Error(`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object 
  e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).`);
}
