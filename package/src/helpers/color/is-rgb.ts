import { RgbaColor, RgbColor } from '../../meta/color';

export function isRgb(color: any): color is RgbColor {
  return typeof color === 'object' &&
      typeof color.red === 'number' &&
      typeof color.green === 'number' &&
      typeof color.blue === 'number' &&
      typeof color.alpha !== 'number';
}
export function isRgba(color: any): color is RgbaColor {
  return typeof color === 'object' &&
      typeof color.red === 'number' &&
      typeof color.green === 'number' &&
      typeof color.blue === 'number' &&
      typeof color.alpha === 'number';
}
