import { guard } from '../../utils/guard';
import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Returns a string value for the lightened color.
 *
 * @example
 * background: lighten(0.2, '#CCCD64'),
 * background: lighten(0.2, 'rgba(204,205,100,0.7)'),
 */
export function lighten(amount: number, color: string): string {
  const hslColor = parseToHsl(color);
  return toColorString({
    ...hslColor,
    lightness: guard(0, 1, hslColor.lightness + amount),
  });
}
