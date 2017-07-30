import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { StyleDef, StyleReactiveDef } from './meta/def';
import { StateSetter } from './meta/state';
import { StylerComponent } from './styler-component';

@Injectable()
export class StylerElement {
  private _sid$ = new BehaviorSubject<string>('');

  private _state: StateSetter = {};

  private stateSize = 0;

  constructor(private component: StylerComponent,
              private def: StyleDef | StyleReactiveDef,
              private elementName: string) {
    this.update();
  }

  get name(): string {
    return this.elementName;
  }

  get sid$(): Observable<string> {
    return this._sid$.asObservable();
  }

  set state(setterRaw: StateSetter) {
    const setter = setterRaw || {};
    if (this.isChanged(setter)) {
      this._state = {...setter};
      this.update();
    }
  }

  applyState(setter: StateSetter): void {
    const newState = {...this._state, ...setter};
    if (this.isChanged(newState)) {
      this._state = newState;
      this.update();
    }
  }

  update() {
    // Util
    this.stateSize = Object.keys(this._state).length;
    // Update sid
    this._sid$.next(this.component.renderElement(this.compile()));
  }

  private compile(): StyleDef {
    if (typeof this.def === "function") {
      return this.def(this._state);
    } else {
      return this.def;
    }
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
