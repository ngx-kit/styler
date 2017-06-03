import { StyleDef } from '../meta/def';

export class StylerCompilerUnit {

  private _style: StyleDef;
  private _hash: string;
  private _selector: string;

  set style(style: StyleDef) {
    this._style = style;
  }

  get style(): StyleDef {
    return this._style;
  }

  // @todo should be private
  set selector(selector: string) {
    this._selector = selector;
  }

  get selector(): string {
    return this._selector;
  }

  // @todo should be private
  set hash(hash: string) {
    this._hash = hash;
  }

  get hash(): string {
    return this._hash;
  }

  destroy() {

  }

}