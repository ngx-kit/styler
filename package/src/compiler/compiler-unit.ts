import { Style } from '../meta/style';

export class StylerCompilerUnit {

  private _style: Style;
  private _hash: string;
  private _selector: string;

  set style(style: Style) {
    this._style = style;
  }

  get style(): Style {
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