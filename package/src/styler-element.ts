import { Injectable } from '@angular/core';

import { StylerCompilerUnit } from './compiler/compiler-unit';
import { StateSetter } from './meta/state';
import { StylerSchema } from './styler-schema';

@Injectable()
export class StylerElement {

  private _state: StateSetter = {};

  constructor(private schema: StylerSchema,
              private unit: StylerCompilerUnit,
              private elementName: string) {
    this._state = this.schema.getDefaultStates(this.elementName);
    this.update();
  }

  set state(setter: StateSetter) {
    this._state = {...setter};
    this.update();
  }

  get sid(): string {
    return this.unit.hash;
  }

  get name(): string {
    return this.elementName;
  }

  applyState(setter: StateSetter): void {
    this._state = {...this._state, ...setter};
    this.update();
  }

  hasState(name: string): boolean {
    return this.schema.hasState(this.elementName, name);
  }

  destroy(): void {
    this.unit.destroy();
  }

  private update() {
    this.unit.style = this.schema.compile(this.elementName, this._state);
  }

}