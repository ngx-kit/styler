import { Directive, Host, HostBinding, Input, ViewContainerRef } from '@angular/core';
import { StylerService } from './styler.service';

@Directive({
  selector: '[s]'
})
export class StylerDirective {

  @Input() s: string;

  @HostBinding('class') get hostClass() {
    return this.styler.getByName(this.s);
  }

  constructor(private styler: StylerService) {
  }

}
