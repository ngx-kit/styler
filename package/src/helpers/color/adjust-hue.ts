import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Changes the hue of the color. Hue is a number between 0 to 360. The first
 * argument for adjustHue is the amount of degrees the color is rotated along
 * the color wheel.
 *
 * @example
 *   background: adjustHue(180, '#448'),
 *   background: adjustHue(180, 'rgba(101,100,205,0.7)'),
 */
export function adjustHue(degree: number, color: string): string {
  const hslColor = parseToHsl(color);
  return toColorString({
    ...hslColor,
    hue: (hslColor.hue + degree) % 360,
  });
}
