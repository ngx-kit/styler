import {
  AfterViewInit,
  ContentChildren, Directive, HostBinding, Input, OnChanges, OnInit, Optional,
  QueryList
} from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';

import { StylerService } from './styler.service';
import { DirectiveSelector } from './interfaces';
import { isString } from './utils';
import { StylerUnit } from './styler_unit';

@Directive({
  selector: '[styler]'
})
export class StylerDirective implements OnChanges, OnInit, AfterViewInit {

  private unit: StylerUnit;

  @Input() set styler(selector: string | DirectiveSelector) {
    if (selector) {
      // @todo validate selector
      if (!this.unit) {
        const elementName = isString(selector) ? selector : selector[0];
        this.unit = this.stylerService.createUnit(elementName);
      }
      if (!isString(selector)) {
        this.unit.setState(selector[1]);
      }
    }
  }

  @HostBinding('class') get hostClass(): string | null {
    return this.unit
        ? this.unit.getClass()
        : null;
  }

  @ContentChildren(RouterLink, {descendants: true}) links: QueryList<RouterLink>;
  @ContentChildren(RouterLinkWithHref, {descendants: true}) linksWithHrefs: QueryList<RouterLinkWithHref>;

  private elementName: string | null = null;

  constructor(private stylerService: StylerService,
              @Optional() private router: Router,
              @Optional() private routerLink: RouterLink) {
  }

  ngOnChanges() {
    this.update();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.update();
  }

  private update() {
    console.log('UPD', this.routerLink, this.links, this.linksWithHrefs);
    if (this.router &&
        (this.links || this.linksWithHrefs) &&
        this.unit &&
        this.unit.hasState('routerLinkActive')) {
      const isActive = this.hasActiveLinks();
      console.log('isAct', this.elementName, this.unit.hasState('routerLinkActive'), isActive);
      this.unit.setState({routerLinkActive: isActive});
    }
  }

  private hasActiveLinks(): boolean {
    return this.links.some(this.isLinkActive(this.router)) ||
        this.linksWithHrefs.some(this.isLinkActive(this.router));
  }

  private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
    return (link: RouterLink | RouterLinkWithHref) =>
        router.isActive(link.urlTree, true);
  }

}
