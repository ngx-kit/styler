import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Converts the color to a grayscale, by reducing its saturation to 0.
 *
 * @example
 * background: grayscale('#CCCD64'),
 * background: grayscale('rgba(204,205,100,0.7)'),
 */
export function grayscale(color: string): string {
  return toColorString({
    ...parseToHsl(color),
    saturation: 0,
  });
}
