import { Injectable } from '@angular/core';

import { StylerCompilerUnit } from './compiler/compiler-unit';
import { StateSetter } from './meta/state';
import { StylerComponent } from './styler-component';
import { StyleDef, StyleReactiveDef } from './meta/def';

@Injectable()
export class StylerElement {

  private _state: StateSetter = {};
  private stateSize = 0;

  constructor(private component: StylerComponent,
              private def: StyleDef | StyleReactiveDef,
              private unit: StylerCompilerUnit,
              private elementName: string) {
    this.update();
  }

  set state(setterRaw: StateSetter) {
    const setter = setterRaw || {};
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

  destroy(): void {
    this.component.destroyUnit(this.unit);
  }

  update() {
    // Util
    this.stateSize = Object.keys(this._state).length;
    // Update style
    this.unit.style = this.compile();
    this.render();
  }

  render() {
    this.component.render(this.unit, `element:${this.elementName}.render`);
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

  private compile(): StyleDef {
    if (typeof this.def === "function") {
      return this.def(this._state);
    } else {
      return this.def;
    }
  }

}
