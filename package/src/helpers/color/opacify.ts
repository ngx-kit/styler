import { guard } from '../../utils/guard';
import { parseToRgb } from './parse-to-rgb';
import { rgba } from './rgba';

/**
 * Increases the opacity of a color. Its range for the amount is between 0 to 1.
 *
 * @example
 * background: opacify(0.1, 'rgba(255, 255, 255, 0.9)');
 * background: opacify(0.2, 'hsla(0, 0%, 100%, 0.5)'),
 * background: opacify(0.5, 'rgba(255, 0, 0, 0.2)'),
 */
export function opacify(amount: number, color: string) {
  const parsedColor = parseToRgb(color);
  const alpha: number = typeof parsedColor['alpha'] === 'number' ? parsedColor['alpha'] : 1;
  const colorWithAlpha = {
    ...parsedColor,
    alpha: guard(0, 1, (
        (alpha * 100) + (amount * 100)
    ) / 100),
  };
  return rgba(colorWithAlpha);
}
