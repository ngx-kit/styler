import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { StylerCompilerUnit } from './compiler-unit';
import { Style } from '../meta/style';
import { stylerHash } from '../meta/tokens';
import { StylerHashService } from '../meta/hash';
import { isString } from '../utils';
import { autoPx } from '../meta/compiler';

@Injectable()
export class StylerCompilerService {

  private node: HTMLStyleElement;
  private units: StylerCompilerUnit[] = [];

  // @todo move to DI
  private readonly attr = 'sid';

  constructor(@Inject(DOCUMENT) private doc: any,
              @Inject(stylerHash) private hash: StylerHashService) {
    this.initStylesNode();
  }

  create(): StylerCompilerUnit {
    const unit = new StylerCompilerUnit();
    this.units.push(unit);
    return unit;
  }

  render(): void {
    const hashes: string[] = [];
    let css = '';
    this.units.forEach(unit => {
      const props = this.compileProps(unit.style);
      const hash = this.hash.hash(props);
      if (!hashes.includes(hash)) {
        css = `${css}[${this.attr}="${hash}"],[${this.attr}-${hash}]{${props}}`;
        hashes.push(hash);
      }
      unit.hash = hash;
    });
    this.setCss(css);
  }

  private setCss(css: string): void {
    this.node.textContent = css;
  }

  private initStylesNode(): void {
    const head = this.getHeadNode();
    if (head) {
      this.node = this.doc.createElement('style');
      head.appendChild(this.node);
    } else {
      // @todo non-browser work
      throw new Error('Non-browser work is not supported yet.');
    }
  }

  private getHeadNode(): HTMLHeadElement | null {
    return this.doc && this.doc.head
        ? document.head
        : null;
  }

  private compileProps(style: Style): string {
    let text = '';
    for (const prop in style) {
      const rawValue = style[prop];
      let value = '';
      if (!isString(rawValue) && autoPx.includes(prop)) {
        value = `${rawValue}px`;
      } else {
        value = rawValue;
      }
      text = `${text}${this.hyphenate(prop)}:${value};`;
    }
    return text;
  }

  private hyphenate(propertyName: string): string {
    return propertyName
        .replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-') // Internet Explorer vendor prefix.
        .toLowerCase();
  }

}