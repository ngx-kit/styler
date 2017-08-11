import { guard } from '../../utils/guard';
import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Increases the intensity of a color. Its range is between 0 to 1. The first
 * argument of the saturate function is the amount by how much the color
 * intensity should be increased.
 *
 * @example
 * background: saturate(0.2, '#CCCD64'),
 * background: saturate(0.2, 'rgba(204,205,100,0.7)'),
 */
export function saturate(amount: number, color: string): string {
  const hslColor = parseToHsl(color);
  return toColorString({
    ...hslColor,
    saturation: guard(0, 1, hslColor.saturation + amount),
  });
}
