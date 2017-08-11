import { HslaColor, HslColor, RgbaColor, RgbColor } from '../../meta/color';
import { hsl } from './hsl';
import { hsla } from './hsla';
import { isHsl, isHsla } from './is-hsl';
import { isRgb, isRgba } from './is-rgb';
import { rgb } from './rgb';
import { rgba } from './rgba';

/**
 * Converts a RgbColor, RgbaColor, HslColor or HslaColor object to a color string.
 * This util is useful in case you only know on runtime which color object is
 * used. Otherwise we recommend to rely on `rgb`, `rgba`, `hsl` or `hsla`.
 *
 * @example
 *   background: toColorString({ red: 255, green: 205, blue: 100 }),
 *   background: toColorString({ red: 255, green: 205, blue: 100, alpha: 0.72 }),
 *   background: toColorString({ hue: 240, saturation: 1, lightness: 0.5 }),
 *   background: toColorString({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0.72 }),
 */
export function toColorString(color: RgbColor | RgbaColor | HslColor | HslaColor): string {
  if (isRgba(color)) {
    return rgba(color);
  } else if (isRgb(color)) {
    return rgb(color);
  } else if (isHsla(color)) {
    return hsla(color);
  } else if (isHsl(color)) {
    return hsl(color);
  }
  throw new Error(`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor 
  object.`);
}
