import { Style } from './style';
import { StateSetter, StateValue } from './state';
import { NestedCSSSelectors } from './css';

export interface StyleDef extends Style {
  $nest?: NestedCSSSelectors<Style>;
//  $media?: [types.MediaQuery, types.NestedCSSProperties][];
}

export interface ElementDef extends StyleDef {
  $states?: {
    [key: string]: StateDef | undefined;
    routerLinkActive?: StyleDef;
  };
}

export type StateDef = StyleDef | [MultiStateDef];

export interface MultiStateDef {
  [key: string]: StyleDef | StateValue | undefined;
  $default?: StateValue;
}

export interface RegistrationDef {
  [key: string]: ElementDef;
}

export type DirectiveSelector = [string, StateSetter];
