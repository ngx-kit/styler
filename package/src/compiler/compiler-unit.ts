import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StyleDef } from '../meta/def';

export class StylerCompilerUnit {
  css: string;

  hash = new BehaviorSubject<string>('');

  style: StyleDef;
}
