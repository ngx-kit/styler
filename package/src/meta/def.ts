import { MediaQuery, NestedCSSSelectors } from './css';
import { StateSetter } from './state';
import { Style } from './style';

export interface StyleDef extends Style {
  $media?: [MediaQuery, StyleDef][];
  $nest?: NestedCSSSelectors<StyleDef>;
}

export interface StyleReactiveDef {
  (state: any, componentState: any): StyleDef;
}

export interface WrappedStyleDef {
  (): StyleDef;
}

export interface PickStyleDef {
  [key: string]: StyleDef | WrappedStyleDef;
}

export type ElementDef = (StyleDef | StyleReactiveDef)[];
export type DirectiveSelector = [string, StateSetter];
