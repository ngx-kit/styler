import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { StylerCompilerUnit } from './compiler-unit';
import { Style } from '../meta/style';
import { stylerHash } from '../meta/tokens';
import { StylerHashService } from '../meta/hash';
import { isString, objectFilter } from '../utils';
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
      // root
      const compiled = [this.compileProps('',objectFilter(unit.style, ['$nest']))];
      // nested
      if (unit.style.$nest) {
        for(const selector in unit.style.$nest) {
          const styles = unit.style.$nest[selector];
          if (styles) {
            compiled.push(this.compileProps(selector, styles));
          }
        }
      }
      // gen hash
      const hash = this.hash.hash(compiled.join());
      // compile css
      if (!hashes.includes(hash)) {
        const selector = `[${this.attr}="${hash}"],[${this.attr}-${hash}]`;
        css = compiled.reduce((prev, curr) => `${prev}${selector}${curr}`, css);
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

  private compileProps(selector: string, style: Style): string {
    let compiled = '';
    for (const rawProp in style) {
      const rawValue = style[rawProp];
      const prop = this.hyphenate(rawProp);
      if (Array.isArray(rawValue)) {
        rawValue.forEach(subValue => compiled += this.compileSingleProp(prop, subValue));
      } else {
        compiled += this.compileSingleProp(prop, rawValue);
      }
    }
    return `${selector.replace(/&/g, '')}{${compiled}}`;
  }

  private compileSingleProp(prop: string, rawValue: string):string {
    let value = '';
    if (!isString(rawValue) && autoPx.includes(prop)) {
      value = `${rawValue}px`;
    } else {
      value = rawValue;
    }
    return `${prop}:${value};`;
  }

  private hyphenate(propertyName: string): string {
    return propertyName
        .replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-') // Internet Explorer vendor prefix.
        .toLowerCase();
  }

}