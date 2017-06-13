import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { StylerCompilerUnit } from './compiler-unit';
import { Style } from '../meta/style';
import { stylerHash } from '../meta/tokens';
import { StylerHashService } from '../meta/hash';
import { objectFilter } from '../utils/object-filter';
import { autoPx } from '../meta/compiler';
import { isString } from '../utils/is-string';
import { compilePadding } from './props/padding';
import { processAutoPx } from '../helpers/process-auto-px';
import { compileMargin } from './props/margin';
import { compileBorder } from './props/border';

@Injectable()
export class StylerCompilerService {

  private debug = true;
  private debugId = 0;

  private node: HTMLStyleElement;
  private units: StylerCompilerUnit[] = [];
  private rendered: {hash: string, css: string}[] = [];
  private hashes: string[] = [];

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

  render(unit?: StylerCompilerUnit, source?: string): void {
    if (unit) {
      // update passed unit
      this.updateUnit(unit);
    } else {
      // update all units
      this.updateAllUnits();
    }
    // gather hashes
    this.hashes = [];
    this.units.forEach(unit => {
      if (this.hashes.includes(unit.hash) === false) {
        this.hashes.push(unit.hash);
      }
    });
    // render
    this.renderCss();
    // debug
    if (this.debug) {
      this.log(`render(source:${source})`, {
        units: this.units.length,
        hashes: this.hashes.length,
      });
    }
  }

  destroyUnit(unit: StylerCompilerUnit) {
    const index = this.units.indexOf(unit);
    if (index !== -1) {
      this.units.splice(index, 1);
    }
  }

  private updateUnit(unit: StylerCompilerUnit): void {
    // root
    const compiled = [this.compileProps('', objectFilter(unit.style, ['$nest']))];
    // nested
    if (unit.style.$nest) {
      for (const selector in unit.style.$nest) {
        const styles = unit.style.$nest[selector];
        if (styles) {
          compiled.push(this.compileProps(selector, styles));
        }
      }
    }
    // gen hash
    unit.hash = this.hash.hash(compiled.join());
    // render css or get from cache
    const rendered = this.rendered.find(r => r.hash === unit.hash);
    if (!rendered) {
      const selector = `[${this.attr}="${unit.hash}"],[${this.attr}-${unit.hash}]`;
      unit.css = compiled.reduce((prev, curr) => `${prev}${selector}${curr}`, '');
      // save to cache
      this.rendered.push({hash: unit.hash, css: unit.css});
    } else {
      unit.css = rendered.css;
    }
  }

  private updateAllUnits(): void {
    this.units.forEach(unit => this.updateUnit(unit));
    if (this.debug) {
      this.log('updateAllUnits', {
        units: this.units.length,
      });
    }
  }

  private renderCss(): void {
    const css = this.hashes.reduce((prev, curr) => {
      const localCss = this.rendered.find(r => r.hash === curr);
      if (localCss && localCss.css) {
        return `${prev}${localCss.css}`;
      } else {
        if (this.debug) {
          this.log('rendered', this.rendered);
        }
        throw new Error(`Styler: local css for hash "${curr}" not found!`);
      }
    }, '');
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
      throw new Error('Styler: Non-browser work is not supported yet.');
    }
  }

  private getHeadNode(): HTMLHeadElement | null {
    return this.doc && this.doc.head
        ? document.head
        : null;
  }

  // @todo it should be optimized
  private compileProps(selector: string, style: Style): string {
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
      } else if (Array.isArray(rawValue)) {
        // fallback
        rawValue.forEach(subValue => compiled += this.compileSingleProp(prop, subValue));
      } else {
        compiled += this.compileSingleProp(prop, rawValue);
      }
    }
    return `${selector.replace(/&/g, '')}{${compiled}}`;
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
