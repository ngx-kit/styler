import { Directive, HostBinding, Input } from '@angular/core';

import { StylerService } from './styler.service';
import { DirectiveSelector } from './interfaces';
import { isString } from './utils';

@Directive({
  selector: '[styler]'
})
export class StylerDirective {

  @Input() set styler(selector: string | DirectiveSelector) {
    if (!selector) {
      this.elementName = null;
    } else if (isString(selector)) {
      this.elementName = selector;
    } else {
      // @todo validate selector
      this.elementName = selector[0];
      this.stylerService.setState(this.elementName, selector[1]);
    }
  }

  @HostBinding('class') get hostClass(): string | null {
    return this.elementName
        ? this.stylerService.getClass(this.elementName)
        : null;
  }

  private elementName: string | null = null;

  constructor(private stylerService: StylerService) {
  }

}
