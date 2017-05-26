import { types } from 'typestyle';

export interface Style extends types.NestedCSSProperties {
  $media?: [types.MediaQuery, types.NestedCSSProperties][];
}

export type StateValue = string | number | boolean | null;

export interface Element {
  name: string;
  style: Style;
  states: State[];
  routerLinkActive?: Style;
}

export interface State {
  name: string;
  values: {
    value: StateValue;
    style: Style;
  }[];
  // @todo rename to defaultValue
  currentValue: StateValue;
}

export interface StateSetter {
  [key: string]: StateValue;
}

export interface ElementDef extends Style {
  $states?: {
    [key: string]: StateDef | undefined;
    routerLinkActive?: Style;
  };
}

export type StateDef = Style | [MultiStateDef];

export interface MultiStateDef {
  [key: string]: Style | StateValue | undefined;
  $default?: StateValue;
}

export interface RegistrationDef {
  [key: string]: ElementDef;
}

export type DirectiveSelector = [string, StateSetter];
