import { Style } from './style';
import { StateValue } from './state';

export interface StyleSchema extends Style {
}

export interface ElementSchema {
  name: string;
  style: StyleSchema;
  states: StateSchema[];
  routerLinkActive?: StyleSchema;
}

export interface StateSchema {
  name: string;
  values: {
    value: StateValue;
    style: StyleSchema;
  }[];
  defaultValue: StateValue;
}
