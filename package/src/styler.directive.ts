import { Directive, HostBinding, Input } from '@angular/core';

import { StylerService } from './styler.service';

@Directive({
  selector: '[styler]'
})
export class StylerDirective {

  @Input() styler: string;

  @HostBinding('class') get hostClass() {
    return this.stylerService.getByName(this.styler);
  }

  constructor(private stylerService: StylerService) {
  }

}
