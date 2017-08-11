import { guard } from '../../utils/guard';
import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Decreases the intensity of a color. Its range is between 0 to 1. The first
 * argument of the desaturate function is the amount by how much the color
 * intensity should be decreased.
 *
 * @example
 *   background: desaturate(0.2, '#CCCD64'),
 *   background: desaturate(0.2, 'rgba(204,205,100,0.7)'),
 */
export function desaturate(amount: number, color: string): string {
  const hslColor = parseToHsl(color);
  return toColorString({
    ...hslColor,
    saturation: guard(0, 1, hslColor.saturation - amount),
  });
}
