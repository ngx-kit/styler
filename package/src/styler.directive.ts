import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { DirectiveSelector } from './meta/def';
import { StylerComponent } from './styler-component';
import { StylerElement } from './styler-element';
import { isString } from './utils/is-string';

/**
 * @todo restore routerLinkActive handler
 */
@Directive({
  selector: '[styler]',
})
export class StylerDirective implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @ContentChildren(RouterLink, {descendants: true}) links: QueryList<RouterLink>;

  @ContentChildren(RouterLinkWithHref, {descendants: true}) linksWithHrefs: QueryList<RouterLinkWithHref>;

  private element: StylerElement;

  private elementName: string | null = null;

  private sid: string;

  constructor(private component: StylerComponent,
              private el: ElementRef,
              private renderer: Renderer2,
              @Optional() private router: Router) {
  }

  @Input()
  set styler(selector: string | DirectiveSelector) {
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

  ngAfterViewInit() {
    this.initUpdater();
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    this.element.destroy();
  }

  ngOnInit() {
    this.initUpdater();
  }

  private checkRouterLink() {
//    if (this.router &&
//        (this.links || this.linksWithHrefs) &&
//        this.element &&
//        this.element.hasState('routerLinkActive')) {
//      const isActive = this.hasActiveLinks();
//      this.element.state = {routerLinkActive: isActive};
//    }
  }

  private hasActiveLinks(): boolean {
    return this.links.some(this.isLinkActive(this.router)) ||
        this.linksWithHrefs.some(this.isLinkActive(this.router));
  }

  private initUpdater() {
    this.element.sid$.subscribe(sid => {
      this.checkRouterLink();
      this.updateSid(sid);
    });
  }

  private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
    return (link: RouterLink | RouterLinkWithHref) =>
        router.isActive(link.urlTree, true);
  }

  private updateSid(sid: string) {
    // check if changed
    if (this.sid !== sid) {
      // remove prev
      this.renderer.removeAttribute(this.el.nativeElement, `sid-${this.sid}`);
      // add new
      this.sid = sid;
      this.renderer.setAttribute(this.el.nativeElement, `sid-${this.sid}`, '');
    }
  }
}
