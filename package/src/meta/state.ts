export type StateValue = string | number | boolean | null;

export interface StateSetter {
  [key: string]: StateValue;
}
