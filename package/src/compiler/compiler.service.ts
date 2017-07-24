import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { processAutoPx } from '../helpers/process-auto-px';
import { autoPx } from '../meta/compiler';
import { StylerHashService } from '../meta/hash';
import { Style } from '../meta/style';
import { stylerHash } from '../meta/tokens';
import { isString } from '../utils/is-string';
import { objectFilter } from '../utils/object-filter';
import { StylerCompilerUnit } from './compiler-unit';
import { compileBorder } from './props/border';
import { compileMargin } from './props/margin';
import { compilePadding } from './props/padding';

@Injectable()
export class StylerCompilerService {
  private debug = true;

  private debugId = 0;

  private hashes: string[] = [];

  private node: HTMLStyleElement;

  private rendered: {hash: string, css: string}[] = [];

  private units: StylerCompilerUnit[] = [];

  constructor(@Inject(DOCUMENT) private doc: any,
              @Inject(stylerHash) private hash: StylerHashService) {
    this.initStylesNode();
  }

  create(): StylerCompilerUnit {
    const unit = new StylerCompilerUnit();
    this.units.push(unit);
    return unit;
  }

  destroyUnit(unit: StylerCompilerUnit) {
    const index = this.units.indexOf(unit);
    if (index !== -1) {
      this.units.splice(index, 1);
    }
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
      if (this.hashes.includes(unit.hash.value) === false) {
        this.hashes.push(unit.hash.value);
      }
    });
    // render
    this.renderCss();
    // debug
    if (this.debug) {
      this.log(`render(source:${source})`, {
        units: this.units,
        hashes: this.hashes,
      });
    }
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

  private getHeadNode(): HTMLHeadElement | null {
    return this.doc && this.doc.head
        ? document.head
        : null;
  }

  private hyphenate(propertyName: string): string {
    return propertyName
        .replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-') // Internet Explorer vendor prefix.
        .toLowerCase();
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

  private log(...params: any[]) {
    this.debugId++;
    console.log(`[${this.debugId}] Styler >> `, ...params);
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

  private updateAllUnits(): void {
    this.units.forEach(unit => this.updateUnit(unit));
    if (this.debug) {
      this.log('updateAllUnits', {
        units: this.units,
        hashes: this.hashes,
      });
    }
  }

  private updateUnit(unit: StylerCompilerUnit): void {
    // root
    const compiled = [{
      selector: '',
      props: this.compileProps(objectFilter(unit.style, ['$nest'])),
    }];
    // nested
    if (unit.style.$nest) {
      for (const selector in unit.style.$nest) {
        const styles = unit.style.$nest[selector];
        if (styles) {
          compiled.push({
            selector: selector.replace(/&/g, ''),
            props: this.compileProps(styles),
          });
        }
      }
    }
    // gen hash
    const newHash = this.hash.hash(compiled.map(c => c.selector + c.props).join());
    // render css or get from cache
    const rendered = this.rendered.find(r => r.hash === newHash);
    if (!rendered) {
      const attrSelector = `[sid-${newHash}]`;
      const hostAttrSelector = `[host-sid-${newHash}]`;
      const attrValueSelector = `[sid="${newHash}"]`;
      unit.css = compiled.reduce((prev, curr) => {
        return `${prev}${attrSelector}${curr.selector},${hostAttrSelector}${curr.selector},` +
            `${attrValueSelector}${curr.selector}{${curr.props}}`;
      }, '');
      // save to cache
      this.rendered.push({hash: newHash, css: unit.css});
    } else {
      unit.css = rendered.css;
    }
    // update hash in unit
    unit.hash.next(newHash);
  }
}
