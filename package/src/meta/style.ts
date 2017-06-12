import { CSSProperties, NestedCSSSelectors } from './css';

export type RawCss = CSSProperties;

export interface Style extends RawCss {
  padding?: CssPadding,
}

export type CssPadding = CssPaddingValue | CssSmartPadding;

export type CssPaddingValue = number | string;

export type CssSmartPadding = [CssPaddingValue, CssPaddingValue]
    | [CssPaddingValue, CssPaddingValue, CssPaddingValue]
    | [CssPaddingValue, CssPaddingValue, CssPaddingValue, CssPaddingValue];
