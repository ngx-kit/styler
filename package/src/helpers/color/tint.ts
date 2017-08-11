import { mix } from './mix';

/**
 * Tints a color by mixing it with white. `tint` can produce
 * hue shifts, where as `lighten` manipulates the luminance channel and therefore
 * doesn't produce hue shifts.
 *
 * @example
 * background: tint(0.25, '#00f')
 */
export function tint(percentage: number, color: string) {
  if (typeof percentage !== 'number' || percentage > 1 || percentage < -1) {
    throw new Error(`Passed an incorrect argument to tint, please pass a percentage less than or equal to 1 and larger 
    than or equal to -1.`);
  }
  if (typeof color !== 'string') {
    throw new Error(`Passed an incorrect argument to a color function, please pass a string representation of a 
    color.`);
  }
  return mix(percentage, color, 'rgb(255, 255, 255)');
}
