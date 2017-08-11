import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Returns the complement of the provided color. This is identical to adjustHue(180, <color>).
 *
 * @example
 *   background: complement('#448'),
 *   background: complement('rgba(204,205,100,0.7)'),
 */
export function complement(color: string): string {
  const hslColor = parseToHsl(color);
  return toColorString({
    ...hslColor,
    hue: (hslColor.hue + 180) % 360,
  });
}
