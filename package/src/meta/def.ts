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

export interface PickStyleDef {
  [key: string]: StyleDef;
}

export type DirectiveSelector = [string, StateSetter];
