import { guard } from '../../utils/guard';
import { parseToRgb } from './parse-to-rgb';
import { rgba } from './rgba';

/**
 * Decreases the opacity of a color. Its range for the amount is between 0 to 1.
 *
 * @example
 * background: transparentize(0.1, '#fff');
 * background: transparentize(0.2, 'hsl(0, 0%, 100%)'),
 * background: transparentize(0.5, 'rgba(255, 0, 0, 0.8)'),
 */
export function transparentize(amount: number, color: string) {
  const parsedColor = parseToRgb(color);
  const alpha: number = typeof parsedColor['alpha'] === 'number' ? parsedColor['alpha'] : 1;
  const colorWithAlpha = {
    ...parsedColor,
    alpha: guard(0, 1, (
        (alpha * 100) - (amount * 100)
    ) / 100),
  };
  return rgba(colorWithAlpha);
}
