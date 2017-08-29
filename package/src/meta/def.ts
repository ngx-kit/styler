import { MediaQuery, NestedCSSSelectors } from './css';
import { StateSetter } from './state';
import { Style } from './style';

export interface StyleWithNestDef extends Style {
  $nest?: NestedCSSSelectors<Style>;
}

export interface StyleDef extends StyleWithNestDef {
  $media?: [MediaQuery, StyleWithNestDef][];
}

export interface StyleReactiveDef {
  (state: any): StyleDef;
}

export interface WrappedStyleDef {
  (): StyleDef;
}

export interface PickStyleDef {
  [key: string]: StyleDef | WrappedStyleDef;
}

export type ElementDef = (StyleDef | StyleReactiveDef)[];
export type DirectiveSelector = [string, StateSetter];
