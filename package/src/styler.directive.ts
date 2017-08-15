import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CompilerService } from './compiler/compiler.service';
import { defMerge } from './helpers/def/def-merge';
import { DirectiveSelector, StyleDef } from './meta/def';
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

  private classes = new Set<string>();

  private element: StylerElement;

  private elementName: string | null = null;

  private hostDef$ = new BehaviorSubject<StyleDef>({});

  private sid: string;

  constructor(@Inject(forwardRef(() => StylerComponent)) private component: StylerComponent,
              private el: ElementRef,
              private renderer: Renderer2,
              private compiler: CompilerService,
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
    // @todo destroy element
  }

  ngOnInit() {
    this.initUpdater();
  }

  registerHostDef(def$: Observable<StyleDef>) {
    def$.subscribe(this.hostDef$);
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
    Observable
        .combineLatest(this.hostDef$, this.element.def$)
        .subscribe((defs: StyleDef[]) => {
          this.updateSid(this.compiler.renderElement(defMerge(defs)));
        });
    this.element.classes$.subscribe(classes => {
      this.component.setElClasses(this.el.nativeElement, this.classes, classes);
      this.classes = new Set(classes);
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
      this.renderer.removeAttribute(this.el.nativeElement, this.sid);
      // add new
      this.sid = sid;
      this.renderer.setAttribute(this.el.nativeElement, this.sid, '');
    }
  }
}
