import { Injectable } from '@angular/core';
import { ClassGenStategy } from './class-gen-stategy';

@Injectable()
export class NoopClassGenStrategy extends ClassGenStategy {
  gen() {
    return new Set();
  }
}
