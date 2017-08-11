import { parseToHsl } from './parse-to-hsl';
import { toColorString } from './to-color-string';

/**
 * Sets the hue of a color to the provided value. The hue range can be
 * from 0 and 359.
 *
 * @example
 *   background: setHue(42, '#CCCD64'),
 *   background: setHue(244, 'rgba(204,205,100,0.7)'),
 */
export function setHue(hue: number, color: string): string {
  return toColorString({
    ...parseToHsl(color),
    hue,
  });
}
