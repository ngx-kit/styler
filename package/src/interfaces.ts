import { types } from 'typestyle';

export interface Style extends types.NestedCSSProperties {
  $media?: [types.MediaQuery, types.NestedCSSProperties][];
}

export type StateValue = string | number | null;

export interface Element {
  name: string;
  style: Style;
  states: State[];
}

export interface State {
  name: string;
  values: {
    value: StateValue;
    style: Style;
  }[];
  currentValue: StateValue;
}

export interface StateSetter {
  [key: string]: StateValue;
}

export interface ElementDef extends Style {
  $states?: {
    [key: string]: StateDef;
  }
}

export interface StateDef {
  [key: string]: Style | StateValue | undefined;
  $default?: StateValue;
}

export interface RegistrationDef {
  [key: string]: ElementDef;
}

export type DirectiveSelector = [string, StateSetter];
