import { HslaColor, HslColor } from '../../meta/color';

export function isHsl(color: any): color is HslColor {
  return typeof color === 'object' &&
      typeof color.hue === 'number' &&
      typeof color.saturation === 'number' &&
      typeof color.lightness === 'number' &&
      typeof color.alpha !== 'number';
}
export function isHsla(color: any): color is HslaColor {
  return typeof color === 'object' &&
      typeof color.hue === 'number' &&
      typeof color.saturation === 'number' &&
      typeof color.lightness === 'number' &&
      // $FlowIgnoreNextLine not sure why this complains
      typeof color.alpha === 'number'
}
