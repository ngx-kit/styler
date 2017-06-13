import { CSSProperties, NestedCSSSelectors } from './css';

export type RawCss = CSSProperties;

export interface Style extends RawCss {
  padding?: CssPadding,
}

export type CssPadding = CssPaddingValue | CssPaddingSmart | CssPaddingProps;

export type CssPaddingValue = number | string;

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

export type CssMarginValue = number | string;

export type CssMarginSmart = [CssMarginValue, CssMarginValue]
    | [CssMarginValue, CssMarginValue, CssMarginValue]
    | [CssMarginValue, CssMarginValue, CssMarginValue, CssMarginValue];

export interface CssMarginProps {
  bottom?: CssMarginValue;
  left?: CssMarginValue;
  right?: CssMarginValue;
  top?: CssMarginValue;
}
