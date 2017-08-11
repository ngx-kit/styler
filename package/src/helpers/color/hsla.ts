import { HslaColor } from '../../meta/color';
import { hslToHex } from './hsl-to-hex';
import { hslToRgb } from './hsl-to-rgb';

/**
 * Returns a string value for the color. The returned result is the smallest possible rgba or hex notation.
 *
 * @example
 *   background: hsla(359, 0.75, 0.4, 0.7),
 *   background: hsla({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0,7 }),
 *   background: hsla(359, 0.75, 0.4, 1),
 */
export function hsla(value: HslaColor | number, saturation?: number, lightness?: number, alpha?: number): string {
  if (typeof value === 'number' &&
      typeof saturation === 'number' &&
      typeof lightness === 'number' &&
      typeof alpha === 'number') {
    return alpha >= 1
        ? hslToHex(value, saturation, lightness)
        : `rgba(${hslToRgb(value, saturation, lightness)},${alpha})`;
  } else if (typeof value === 'object' &&
      saturation === undefined &&
      lightness === undefined &&
      alpha === undefined) {
    return value.alpha >= 1
        ? hslToHex(value.hue, value.saturation, value.lightness)
        : `rgba(${hslToRgb(value.hue, value.saturation, value.lightness)},${value.alpha})`;
  }
  throw new Error(`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsl(360, 0.75, 0.4, 0.7) or an 
  object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).`);
}
