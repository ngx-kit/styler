import { types } from 'typestyle';

export type Style = types.NestedCSSProperties;

export interface StylerState {
  name: string;
  value: StylerStateValue;
}

export type StylerStateValue = string | number | null;