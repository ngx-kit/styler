import { Injectable } from '@angular/core';
import { HslaColor, HslColor, RgbaColor, RgbColor } from './meta/color';
import { hslToHex } from './utils/color/hsl-to-hex';
import { hslToRgb } from './utils/color/hsl-to-rgb';
import { isHsl, isHsla } from './utils/color/is-hsl';
import { isRgb, isRgba } from './utils/color/is-rgb';
import { numberToHex } from './utils/color/number-to-hex';
import { parseToHsl } from './utils/color/parse-to-hsl';
import { parseToRgb } from './utils/color/parse-to-rgb';
import { reduceHexValue } from './utils/color/reduce-hex-value';
import { guard } from './utils/guard';

@Injectable()
export class StylerColorService {
  /**
   * Changes the hue of the color. Hue is a number between 0 to 360. The first
   * argument for adjustHue is the amount of degrees the color is rotated along
   * the color wheel.
   *
   * @example
   *   background: adjustHue(180, '#448'),
   *   background: adjustHue(180, 'rgba(101,100,205,0.7)'),
   */
  adjustHue(degree: number, color: string): string {
    const hslColor = parseToHsl(color);
    return this.toColorString({
      ...hslColor,
      hue: (hslColor.hue + degree) % 360,
    });
  }

  /**
   * Returns the complement of the provided color. This is identical to adjustHue(180, <color>).
   *
   * @example
   *   background: complement('#448'),
   *   background: complement('rgba(204,205,100,0.7)'),
   */
  complement(color: string): string {
    const hslColor = parseToHsl(color);
    return this.toColorString({
      ...hslColor,
      hue: (hslColor.hue + 180) % 360,
    });
  }

  /**
   * Returns a string value for the darkened color.
   *
   * @example
   * background: darken(0.2, '#FFCD64')
   * background: darken(0.2, 'rgba(255,205,100,0.7)')
   */
  darken(amount: number, color: string): string {
    const hslColor = parseToHsl(color);
    return this.toColorString({
      ...hslColor,
      lightness: guard(0, 1, hslColor.lightness - amount),
    });
  }

  /**
   * Decreases the intensity of a color. Its range is between 0 to 1. The first
   * argument of the desaturate function is the amount by how much the color
   * intensity should be decreased.
   *
   * @example
   *   background: desaturate(0.2, '#CCCD64'),
   *   background: desaturate(0.2, 'rgba(204,205,100,0.7)'),
   */
  desaturate(amount: number, color: string): string {
    const hslColor = parseToHsl(color);
    return this.toColorString({
      ...hslColor,
      saturation: guard(0, 1, hslColor.saturation - amount),
    });
  }

  /**
   * Converts the color to a grayscale, by reducing its saturation to 0.
   *
   * @example
   * background: grayscale('#CCCD64'),
   * background: grayscale('rgba(204,205,100,0.7)'),
   */
  grayscale(color: string): string {
    return this.toColorString({
      ...parseToHsl(color),
      saturation: 0,
    });
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible hex notation.
   *
   * @example
   * background: hsl(359, 0.75, 0.4)
   * background: hsl({ hue: 360, saturation: 0.75, lightness: 0.4 })
   */
  hsl(value: HslColor | number, saturation?: number, lightness?: number): string {
    if (typeof value === 'number' && typeof saturation === 'number' && typeof lightness === 'number') {
      return hslToHex(value, saturation, lightness);
    } else if (typeof value === 'object' && saturation === undefined && lightness === undefined) {
      return hslToHex(value.hue, value.saturation, value.lightness);
    }
    throw new Error(`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object 
  e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).`);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible rgba or hex notation.
   *
   * @example
   *   background: hsla(359, 0.75, 0.4, 0.7),
   *   background: hsla({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0,7 }),
   *   background: hsla(359, 0.75, 0.4, 1),
   */
  hsla(value: HslaColor | number, saturation?: number, lightness?: number, alpha?: number): string {
    if (typeof value === 'number' &&
        typeof saturation === 'number' &&
        typeof lightness === 'number' &&
        typeof alpha === 'number') {
      return alpha >= 1
          ? hslToHex(value, saturation, lightness)
          : `rgba(${hslToRgb(value, saturation, lightness)},${alpha})`;
    } else if (typeof value === 'object' &&
        saturation === undefined &&
        lightness === undefined &&
        alpha === undefined) {
      return value.alpha >= 1
          ? hslToHex(value.hue, value.saturation, value.lightness)
          : `rgba(${hslToRgb(value.hue, value.saturation, value.lightness)},${value.alpha})`;
    }
    throw new Error(`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsl(360, 0.75, 0.4, 0.7) or an 
  object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).`);
  }

  /**
   * Inverts the red, green and blue values of a color.
   *
   * @example
   * background: invert('#CCCD64'),
   * background: invert('rgba(101,100,205,0.7)'),
   */
  invert(color: string): string {
    // parse color string to rgb
    const value = parseToRgb(color);
    return this.toColorString({
      ...value,
      red: 255 - value.red,
      green: 255 - value.green,
      blue: 255 - value.blue,
    });
  }

  /**
   * Returns a string value for the lightened color.
   *
   * @example
   * background: lighten(0.2, '#CCCD64'),
   * background: lighten(0.2, 'rgba(204,205,100,0.7)'),
   */
  lighten(amount: number, color: string): string {
    const hslColor = parseToHsl(color);
    return this.toColorString({
      ...hslColor,
      lightness: guard(0, 1, hslColor.lightness + amount),
    });
  }

  /**
   * Mixes two colors together by calculating the average of each of the RGB components.
   *
   * By default the weight is 0.5 meaning that half of the first color and half the second
   * color should be used. Optionally the weight can be modified by providing a number
   * as the first argument. 0.25 means that a quarter of the first color and three quarters
   * of the second color should be used.
   *
   * @example
   * background: mix(0.5, '#f00', '#00f')
   * background: mix(0.25, '#f00', '#00f')
   * background: mix(0.5, 'rgba(255, 0, 0, 0.5)', '#00f')
   */
  mix(weight: number = 0.5, color: string, otherColor: string): string {
    const parsedColor1 = parseToRgb(color);
    const color1 = {
      ...parsedColor1,
      alpha: typeof parsedColor1['alpha'] === 'number' ? parsedColor1['alpha'] : 1,
    };
    const parsedColor2 = parseToRgb(otherColor);
    const color2 = {
      ...parsedColor2,
      alpha: typeof parsedColor2['alpha'] === 'number' ? parsedColor2['alpha'] : 1,
    };
    // The formular is copied from the original Sass implementation:
    // http://sass-lang.com/documentation/Sass/Script/Functions.html#mix-instance_method
    const alphaDelta = color1.alpha - color2.alpha;
    const x = (weight * 2) - 1;
    const y = x * alphaDelta === -1 ? x : (x + alphaDelta);
    const z = (1 + (x * alphaDelta));
    const weight1 = ((y / z) + 1) / 2.0;
    const weight2 = 1 - weight1;
    const mixedColor = {
      red: Math.floor((color1.red * weight1) + (color2.red * weight2)),
      green: Math.floor((color1.green * weight1) + (color2.green * weight2)),
      blue: Math.floor((color1.blue * weight1) + (color2.blue * weight2)),
      alpha: color1.alpha + ((color2.alpha - color1.alpha) * (weight / 1.0)),
    };
    return this.rgba(mixedColor);
  }

  /**
   * Increases the opacity of a color. Its range for the amount is between 0 to 1.
   *
   * @example
   * background: opacify(0.1, 'rgba(255, 255, 255, 0.9)');
   * background: opacify(0.2, 'hsla(0, 0%, 100%, 0.5)'),
   * background: opacify(0.5, 'rgba(255, 0, 0, 0.2)'),
   */
  opacify(amount: number, color: string) {
    const parsedColor = parseToRgb(color);
    const alpha: number = typeof parsedColor['alpha'] === 'number' ? parsedColor['alpha'] : 1;
    const colorWithAlpha = {
      ...parsedColor,
      alpha: guard(0, 1, (
          (alpha * 100) + (amount * 100)
      ) / 100),
    };
    return this.rgba(colorWithAlpha);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible hex notation.
   *
   * @example
   * background: rgb(255, 205, 100)
   * background: rgb({ red: 255, green: 205, blue: 100 })
   */
  rgb(value: RgbColor | number, green?: number, blue?: number): string {
    if (typeof value === 'number' && typeof green === 'number' && typeof blue === 'number') {
      return reduceHexValue(`#${numberToHex(value)}${numberToHex(green)}${numberToHex(blue)}`);
    } else if (typeof value === 'object' && green === undefined && blue === undefined) {
      return reduceHexValue(`#${numberToHex(value.red)}${numberToHex(value.green)}${numberToHex(value.blue)}`);
    }
    throw new Error(`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object 
  e.g. rgb({ red: 255, green: 205, blue: 100 }).`);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible rgba or hex notation.
   *
   * @example
   * background: rgba(255, 205, 100, 0.7),
   * background: rgba({ red: 255, green: 205, blue: 100, alpha: 0.7 }),
   * background: rgba(255, 205, 100, 1),
   */
  rgba(value: RgbaColor | number, green?: number, blue?: number, alpha?: number): string {
    if (typeof value === 'number' &&
        typeof green === 'number' &&
        typeof blue === 'number' &&
        typeof alpha === 'number') {
      return alpha >= 1 ? this.rgb(value, green, blue) : `rgba(${value},${green},${blue},${alpha})`;
    } else if (typeof value === 'object' && green === undefined && blue === undefined && alpha === undefined) {
      return value.alpha >= 1
          ? this.rgb(value.red, value.green, value.blue)
          : `rgba(${value.red},${value.green},${value.blue},${value.alpha})`;
    }
    throw new Error(`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an 
  object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).`);
  }

  /**
   * Increases the intensity of a color. Its range is between 0 to 1. The first
   * argument of the saturate function is the amount by how much the color
   * intensity should be increased.
   *
   * @example
   * background: saturate(0.2, '#CCCD64'),
   * background: saturate(0.2, 'rgba(204,205,100,0.7)'),
   */
  saturate(amount: number, color: string): string {
    const hslColor = parseToHsl(color);
    return this.toColorString({
      ...hslColor,
      saturation: guard(0, 1, hslColor.saturation + amount),
    });
  }

  /**
   * Sets the hue of a color to the provided value. The hue range can be
   * from 0 and 359.
   *
   * @example
   *   background: setHue(42, '#CCCD64'),
   *   background: setHue(244, 'rgba(204,205,100,0.7)'),
   */
  setHue(hue: number, color: string): string {
    return this.toColorString({
      ...parseToHsl(color),
      hue,
    });
  }

  /**
   * Sets the lightness of a color to the provided value. The lightness range can be
   * from 0 and 1.
   *
   * @example
   * background: setLightness(0.2, '#CCCD64'),
   * background: setLightness(0.75, 'rgba(204,205,100,0.7)'),
   */
  setLightness(lightness: number, color: string): string {
    return this.toColorString({
      ...parseToHsl(color),
      lightness,
    });
  }

  /**
   * Sets the saturation of a color to the provided value. The lightness range can be
   * from 0 and 1.
   *
   * @example
   * background: setSaturation(0.2, '#CCCD64'),
   * background: setSaturation(0.75, 'rgba(204,205,100,0.7)'),
   */
  setSaturation(saturation: number, color: string): string {
    return this.toColorString({
      ...parseToHsl(color),
      saturation,
    });
  }

  /**
   * Shades a color by mixing it with black. `shade` can produce
   * hue shifts, where as `darken` manipulates the luminance channel and therefore
   * doesn't produce hue shifts.
   *
   * @example
   * background: shade(0.25, '#00f')
   */
  shade(percentage: number, color: string) {
    if (typeof percentage !== 'number' || percentage > 1 || percentage < -1) {
      throw new Error(`Passed an incorrect argument to shade, please pass a percentage less than or equal to 1 and larger 
    than or equal to -1.`);
    }
    if (typeof color !== 'string') {
      throw new Error(`Passed an incorrect argument to a color function, please pass a string representation of a 
    color.`);
    }
    return this.mix(percentage, color, 'rgb(0, 0, 0)');
  }

  /**
   * Tints a color by mixing it with white. `tint` can produce
   * hue shifts, where as `lighten` manipulates the luminance channel and therefore
   * doesn't produce hue shifts.
   *
   * @example
   * background: tint(0.25, '#00f')
   */
  tint(percentage: number, color: string) {
    if (typeof percentage !== 'number' || percentage > 1 || percentage < -1) {
      throw new Error(`Passed an incorrect argument to tint, please pass a percentage less than or equal to 1 and larger 
    than or equal to -1.`);
    }
    if (typeof color !== 'string') {
      throw new Error(`Passed an incorrect argument to a color function, please pass a string representation of a 
    color.`);
    }
    return this.mix(percentage, color, 'rgb(255, 255, 255)');
  }

  /**
   * Converts a RgbColor, RgbaColor, HslColor or HslaColor object to a color string.
   * This util is useful in case you only know on runtime which color object is
   * used. Otherwise we recommend to rely on `rgb`, `rgba`, `hsl` or `hsla`.
   *
   * @example
   *   background: toColorString({ red: 255, green: 205, blue: 100 }),
   *   background: toColorString({ red: 255, green: 205, blue: 100, alpha: 0.72 }),
   *   background: toColorString({ hue: 240, saturation: 1, lightness: 0.5 }),
   *   background: toColorString({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0.72 }),
   */
  toColorString(color: RgbColor | RgbaColor | HslColor | HslaColor): string {
    if (isRgba(color)) {
      return this.rgba(color);
    } else if (isRgb(color)) {
      return this.rgb(color);
    } else if (isHsla(color)) {
      return this.hsla(color);
    } else if (isHsl(color)) {
      return this.hsl(color);
    }
    throw new Error(`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor 
  object.`);
  }

  /**
   * Decreases the opacity of a color. Its range for the amount is between 0 to 1.
   *
   * @example
   * background: transparentize(0.1, '#fff');
   * background: transparentize(0.2, 'hsl(0, 0%, 100%)'),
   * background: transparentize(0.5, 'rgba(255, 0, 0, 0.8)'),
   */
  transparentize(amount: number, color: string) {
    const parsedColor = parseToRgb(color);
    const alpha: number = typeof parsedColor['alpha'] === 'number' ? parsedColor['alpha'] : 1;
    const colorWithAlpha = {
      ...parsedColor,
      alpha: guard(0, 1, (
          (alpha * 100) - (amount * 100)
      ) / 100),
    };
    return this.rgba(colorWithAlpha);
  }
}
