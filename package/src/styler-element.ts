import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ClassGenStategy } from './class-gen/class-gen-stategy';
import { ElementDef, StyleDef } from './meta/def';
import { StateSetter } from './meta/state';
import { componentClassPrefix, elementDef, elementName } from './meta/tokens';
import { StylerComponent } from './styler-component';
import { isFunction } from './utils/is-function';
import { mergeDeepAll } from './utils/merge-deep';

@Injectable()
export class StylerElement {
  private _classes$ = new BehaviorSubject<Set<string>>(new Set());

  private _def$ = new BehaviorSubject<StyleDef>({});

  private _state: StateSetter = {};

  private stateSize = 0;

  constructor(private classGen: ClassGenStategy,
              private component: StylerComponent,
              @Inject(componentClassPrefix) private classPrefix: string,
              @Inject(elementName) private elementName: string,
              @Inject(elementDef) private def: ElementDef) {
    this.update();
  }

  get classes$() {
    return this._classes$.asObservable();
  }

  get def$(): Observable<StyleDef> {
    return this._def$.asObservable();
  }

  get name(): string {
    return this.elementName;
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
    // Update def
    this._def$.next(this.compile());
    // Update class
    this.updateClasses();
  }

  updateClasses() {
    if (this.classPrefix) {
      this._classes$.next(this.classGen.gen(this.classPrefix, this.elementName, this._state));
    }
  }

  private compile(): StyleDef {
    return mergeDeepAll(this.def.map(d => {
      return isFunction(d)
          ? d(this._state, this.component.state)
          : d;
    }));
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
