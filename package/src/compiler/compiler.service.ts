import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { ɵSharedStylesHost as SharedStylesHost } from '@angular/platform-browser';
import { processAutoPx } from '../helpers/process-auto-px';
import { autoPx } from '../meta/compiler';
import { StyleDef } from '../meta/def';
import { StylerHashService } from '../meta/hash';
import { Style } from '../meta/style';
import { stylerHash } from '../meta/tokens';
import { isString } from '../utils/is-string';
import { objectFilter } from '../utils/object-filter';
import { compileBorder } from './props/border';
import { compileMargin } from './props/margin';
import { compilePadding } from './props/padding';

// @todo use Set instead []
@Injectable()
export class StylerCompilerService {
  private readonly attrPrefix = 'sid-';

  private debug = true;

  private debugId = 0;

  private hashes = new Set<string>();

  private stylesBuffer = new Set<string>();

  constructor(@Inject(DOCUMENT) private doc: any,
              private sharedStylesHost: SharedStylesHost,
              @Inject(stylerHash) private hash: StylerHashService,
              private zone: NgZone) {
    // add css to head on zone stable
    this.zone.onStable.subscribe(() => {
      this.sharedStylesHost.addStyles([Array.from(this.stylesBuffer).join('')]);
      this.stylesBuffer.clear();
    });
  }

  renderElement(def: StyleDef): string {
    // root
    const compiled = [{
      selector: '',
      props: this.compileProps(objectFilter(def, ['$nest'])),
    }];
    // nested
    if (def.$nest) {
      for (const selector in def.$nest) {
        const styles = def.$nest[selector];
        if (styles) {
          compiled.push({
            selector: selector.replace(/&/g, ''),
            props: this.compileProps(styles),
          });
        }
      }
    }
    // gen hash
    const hash = this.hash.hash(compiled.map(c => c.selector + c.props).join());
    // check if added
    if (!this.hashes.has(hash)) {
      const attrSelector = `[${this.attrPrefix}${hash}]`;
      const css = compiled.reduce((prev, curr) => {
        return `${prev}${attrSelector}${curr.selector}{${curr.props}}`;
      }, '');
      this.addStyles(css);
      console.log('add styles', css);
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
      console.log('add keyframe styles', css);
      this.hashes.add(hash);
    }
    return hash;
  }

  private addStyles(style: string) {
    this.stylesBuffer.add(style);
  }

  // @todo it should be optimized
  private compileProps(style: Style): string {
    let compiled = '';
    for (const rawProp in style) {
      const rawValue = style[rawProp];
      const prop = this.hyphenate(rawProp);
      // smart props
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
    return `${compiled}`;
  }

  private compileSingleProp(prop: string, rawValue: string): string {
    let value = '';
    if (!isString(rawValue) && autoPx.includes(prop)) {
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

  private log(...params: any[]) {
    this.debugId++;
    console.log(`[${this.debugId}] Styler >> `, ...params);
  }
}
