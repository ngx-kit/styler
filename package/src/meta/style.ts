import { CSSColorSet, CSSLength, CSSLineStyle, CSSPercentage, CSSProperties } from './css';

export type RawCss = CSSProperties;

export interface Style extends RawCss {
  border?: CssBorder,
  margin?: CssMargin,
  padding?: CssPadding,
}

export type CssPadding = CssPaddingValue | CssPaddingSmart | CssPaddingProps;
export type CssPaddingValue = CSSLength;
export type CssPaddingSmart = [CssPaddingValue, CssPaddingValue]
    | [CssPaddingValue, CssPaddingValue, CssPaddingValue]
    | [CssPaddingValue, CssPaddingValue, CssPaddingValue, CssPaddingValue];

export interface CssPaddingProps {
  bottom?: CssPaddingValue;
  left?: CssPaddingValue;
  right?: CssPaddingValue;
  top?: CssPaddingValue;
}

export type CssMargin = CssMarginValue | CssMarginSmart | CssMarginProps;
export type CssMarginValue = CSSLength;
export type CssMarginSmart = [CssMarginValue, CssMarginValue]
    | [CssMarginValue, CssMarginValue, CssMarginValue]
    | [CssMarginValue, CssMarginValue, CssMarginValue, CssMarginValue];

export interface CssMarginProps {
  bottom?: CssMarginValue;
  left?: CssMarginValue;
  right?: CssMarginValue;
  top?: CssMarginValue;
}

export type CssBorder = any | CssBorderSmart | CssBorderProps;
export type CssBorderSmart = [CSSLength, CSSLineStyle, CSSColorSet];

export interface CssBorderProps {
  color: CSSColorSet;
  radius: CSSLength | CSSPercentage;
  style: CSSLineStyle;
  width: CSSLength | CSSPercentage;
}
