import { Injectable } from '@angular/core';

import { StylerCompilerUnit } from './compiler/compiler-unit';
import { StateSetter } from './meta/state';
import { StylerSchema } from './styler-schema';
import { StylerComponent } from './styler-component';
import set = Reflect.set;

@Injectable()
export class StylerElement {

  private _state: StateSetter = {};
  private stateSize = 0;

  constructor(private component: StylerComponent,
              private schema: StylerSchema,
              private unit: StylerCompilerUnit,
              private elementName: string) {
    this._state = this.schema.getDefaultStates(this.elementName);
    this.update();
  }

  set state(setter: StateSetter) {
    if (this.isChanged(setter)) {
      this._state = {...setter};
      this.update();
    }
  }

  get sid(): string {
    return this.unit.hash;
  }

  get name(): string {
    return this.elementName;
  }

  applyState(setter: StateSetter): void {
    const newState = {...this._state, ...setter};
    if (this.isChanged(newState)) {
      this._state = newState;
      this.update();
    }
  }

  hasState(name: string): boolean {
    return this.schema.hasState(this.elementName, name);
  }

  destroy(): void {
    this.unit.destroy();
  }

  private update() {
    // Util
    this.stateSize = Object.keys(this._state).length;
    // Update style
    this.unit.style = this.schema.compile(this.elementName, this._state);
    // Render
    this.component.render();
  }

  private isChanged(newState: StateSetter): boolean {
    if (Object.keys(newState).length === this.stateSize) {
      for (const name in newState) {
        if (newState[name] !== this._state[name]) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

}