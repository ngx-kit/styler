import {
  AfterViewInit, ContentChildren, Directive, ElementRef, Input, OnChanges, OnInit, Optional, QueryList, Renderer2
} from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';

import { StylerElement } from './styler-element';
import { StylerComponent } from './styler-component';
import { DirectiveSelector } from './meta/def';
import { isString } from './utils/is-string';

@Directive({
  selector: '[styler]'
})
export class StylerDirective implements OnChanges, OnInit, AfterViewInit {

  private element: StylerElement;
  private sid: string;

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

  @ContentChildren(RouterLink, {descendants: true}) links: QueryList<RouterLink>;
  @ContentChildren(RouterLinkWithHref, {descendants: true}) linksWithHrefs: QueryList<RouterLinkWithHref>;

  private elementName: string | null = null;

  constructor(private component: StylerComponent,
              private el: ElementRef,
              private renderer: Renderer2,
              @Optional() private router: Router) {
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
    this.checkRouterLink();
    this.updateSid();
  }

  private checkRouterLink() {
    if (this.router &&
        (this.links || this.linksWithHrefs) &&
        this.element &&
        this.element.hasState('routerLinkActive')) {
      const isActive = this.hasActiveLinks();
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

  private updateSid() {
    // check if changed
    if (this.sid !== this.element.sid) {
      // remove prev
      this.renderer.removeAttribute(this.el.nativeElement, `sid-${this.sid}`);
      // add new
      this.sid = this.element.sid;
      this.renderer.setAttribute(this.el.nativeElement, `sid-${this.sid}`, '');
    }
  }

}
