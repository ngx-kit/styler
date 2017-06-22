import { Style } from './style';
import { StateSetter } from './state';
import { NestedCSSSelectors } from './css';

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
