import { guard } from '../../utils/guard';
import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Returns a string value for the darkened color.
 *
 * @example
 * background: darken(0.2, '#FFCD64')
 * background: darken(0.2, 'rgba(255,205,100,0.7)')
 */
export function darken(amount: number, color: string): string {
  const hslColor = parseToHsl(color);
  return toColorString({
    ...hslColor,
    lightness: guard(0, 1, hslColor.lightness - amount),
  });
}
