import {
  AfterViewInit,
  ContentChildren, Directive, HostBinding, Input, OnChanges, OnInit, Optional,
  QueryList
} from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';

import { isString } from './utils';
import { StylerElement } from './styler-element';
import { StylerComponent } from './styler-component';
import { DirectiveSelector } from './meta/def';

@Directive({
  selector: '[styler]'
})
export class StylerDirective implements OnChanges, OnInit, AfterViewInit {

  private element: StylerElement;

  @Input() set styler(selector: string | DirectiveSelector) {
    if (selector) {
      // @todo validate selector
      if (!this.element) {
        const elementName = isString(selector) ? selector : selector[0];
        this.element = this.component.createElement(elementName);
      }
      if (!isString(selector)) {
        this.element.state = selector[1];
      }
    }
  }

  @HostBinding('attr.sid') get sid(): string | null {
    return this.element
        ? this.element.sid
        : null;
  }

  @ContentChildren(RouterLink, {descendants: true}) links: QueryList<RouterLink>;
  @ContentChildren(RouterLinkWithHref, {descendants: true}) linksWithHrefs: QueryList<RouterLinkWithHref>;

  private elementName: string | null = null;

  constructor(private component: StylerComponent,
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
    if (this.router &&
        (this.links || this.linksWithHrefs) &&
        this.element &&
        this.element.hasState('routerLinkActive')) {
      const isActive = this.hasActiveLinks();
      console.log('isAct', this.elementName, this.element.hasState('routerLinkActive'), isActive);
      this.element.state = {routerLinkActive: isActive};
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
