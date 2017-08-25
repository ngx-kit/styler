import { NestedCSSSelectors } from './css';
import { StateSetter } from './state';
import { Style } from './style';

export interface StyleDef extends Style {
  $nest?: NestedCSSSelectors<Style>;
//  $media?: [types.MediaQuery, types.NestedCSSProperties][];
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
