import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ɵSharedStylesHost as SharedStylesHost } from '@angular/platform-browser';
import { MediaQuery } from '../meta/css';
import { StyleDef } from '../meta/def';
import { Style } from '../meta/style';
import { isString } from '../utils/is-string';
import { objectFilter } from '../utils/object-filter';
import { HashStrategy } from './hash/hash-strategy';
import { autoPx, processAutoPx } from './process-auto-px';
import { compileBorder } from './props/border';
import { compileMargin } from './props/margin';
import { compilePadding } from './props/padding';

// @todo use Set instead []
@Injectable()
export class CompilerService {
  private readonly attrPrefix = 'sid-';

  private hashes = new Set<string>();

  constructor(@Inject(DOCUMENT) private doc: any,
              private sharedStylesHost: SharedStylesHost,
              private hash: HashStrategy) {
  }

  renderElement(def: StyleDef): string {
    let compiled = this.compileDef(def);
    // media
    if (def.$media) {
      for (const media of def.$media) {
        const mediaCompiled = this.compileDef(media[1], '', this.compileMediaQuery(media[0]));
        compiled = compiled.concat(mediaCompiled);
      }
    }
    // gen hash
    const hash = this.hash.hash(compiled.map(c => c.media + c.selector + c.props).join());
    // check if added
    if (!this.hashes.has(hash)) {
      const selector = `.${this.attrPrefix}${hash}`;
      const css = compiled.reduce((prev, curr) => {
        return curr.media ?
            `${prev}${curr.media}{${selector}${curr.selector}{${curr.props}}}`
            : `${prev}${selector}${curr.selector}{${curr.props}}`;
      }, '');
      this.addStyles(css);
      this.hashes.add(hash);
    }
    return `${this.attrPrefix}${hash}`;
  }

  renderKeyframe(def: any): string {
    let css = '';
    for (const key in def) {
      css += `${key}{${this.compileProps(def[key])}}`
    }
    const hash = `kf-${this.hash.hash(css)}`;
    if (!this.hashes.has(hash)) {
      // @todo impr performace by hash-caching
      this.addStyles(`@keyframes ${hash}{${css}}`);
      this.hashes.add(hash);
    }
    return hash;
  }

  private addStyles(style: string) {
    this.sharedStylesHost.addStyles([style]);
  }

  private compileDef(def: StyleDef, nest = '', media?: string) {
    // root
    let compiled = [{
      selector: nest,
      media,
      props: this.compileProps(objectFilter(def, ['$nest', '$media'])),
    }];
    // nested
    if (def.$nest) {
      for (const selector in def.$nest) {
        const styles = def.$nest[selector];
        if (styles) {
          compiled = [
            ...compiled,
            ...this.compileDef(styles, nest + selector.replace(/&/g, ''), media),
          ];
        }
      }
    }
    return compiled;
  }

  private compileMediaQuery(mediaQuery: MediaQuery) {
    const mediaQuerySections: string[] = [];
    if (mediaQuery.type) mediaQuerySections.push(mediaQuery.type);
    if (mediaQuery.orientation) mediaQuerySections.push(mediaQuery.orientation);
    if (mediaQuery.minWidth) mediaQuerySections.push(`(min-width: ${processAutoPx(mediaQuery.minWidth)})`);
    if (mediaQuery.maxWidth) mediaQuerySections.push(`(max-width: ${processAutoPx(mediaQuery.maxWidth)})`);
    if (mediaQuery.minHeight) mediaQuerySections.push(`(min-height: ${processAutoPx(mediaQuery.minHeight)})`);
    if (mediaQuery.maxHeight) mediaQuerySections.push(`(max-height: ${processAutoPx(mediaQuery.maxHeight)})`);
    return `@media ${mediaQuerySections.join(' and ')}`;
  }

  // @todo it should be optimized
  private compileProps(style: Style): string {
    let compiled = '';
    for (const rawProp in style) {
      const rawValue = style[rawProp];
      const prop = this.hyphenate(rawProp);
      // smart props
      // @todo switch-case
      if (prop === 'padding') {
        compiled += compilePadding(rawValue);
      } else if (prop === 'margin') {
        compiled += compileMargin(rawValue);
      } else if (prop === 'border') {
        compiled += compileBorder(rawValue);
      } else if (prop === 'border-top') {
        compiled += compileBorder(rawValue, 'top');
      } else if (prop === 'border-right') {
        compiled += compileBorder(rawValue, 'right');
      } else if (prop === 'border-bottom') {
        compiled += compileBorder(rawValue, 'bottom');
      } else if (prop === 'border-left') {
        compiled += compileBorder(rawValue, 'left');
      } else if (Array.isArray(rawValue)) {
        // fallback
        rawValue.forEach(subValue => compiled += this.compileSingleProp(prop, subValue));
      } else {
        compiled += this.compileSingleProp(prop, rawValue);
      }
    }
    return compiled;
  }

  private compileSingleProp(prop: string, rawValue: string): string {
    let value = '';
    if (!isString(rawValue) && autoPx.indexOf(prop) !== -1) {
      value = processAutoPx(rawValue);
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
