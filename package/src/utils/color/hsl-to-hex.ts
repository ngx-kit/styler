import { hslToRgb } from './hsl-to-rgb';
import { numberToHex } from './number-to-hex';
import { reduceHexValue } from './reduce-hex-value';

function colorToHex(color: number): string {
  return numberToHex(Math.round(color * 255))
}
function convertToHex(red: number, green: number, blue: number) {
  return reduceHexValue(`#${colorToHex(red)}${colorToHex(green)}${colorToHex(blue)}`)
}
export function hslToHex(hue: number, saturation: number, lightness: number): string {
  return hslToRgb(hue, saturation, lightness, convertToHex)
}