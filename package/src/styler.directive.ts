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
  QueryList,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CompilerService } from './compiler/compiler.service';
import { defMerge } from './helpers/def/def-merge';
import { StyleDef } from './meta/def';
import { StateSetter } from './meta/state';
import { StylerComponent } from './styler-component';
import { StylerElement } from './styler-element';

@Directive({
  selector: '[styler]',
})
export class StylerDirective implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input('styler') elementName: string;

  @ContentChildren(RouterLink, {descendants: true}) links: QueryList<RouterLink>;

  @ContentChildren(RouterLinkWithHref, {descendants: true}) linksWithHrefs: QueryList<RouterLinkWithHref>;

  @Input('stylerState') state: StateSetter;

  private classes = new Set<string>();

  private element: StylerElement;

  private hostDef$ = new BehaviorSubject<StyleDef>({});

  private sid: string;

  constructor(@Inject(forwardRef(() => StylerComponent)) private component: StylerComponent,
              private el: ElementRef,
              private renderer: Renderer2,
              private compiler: CompilerService) {
  }

//  @Input()
//  set styler(selector: string | DirectiveSelector) {
//    if (selector) {
//      // @todo validate selector
//      if (!this.element) {
//        const elementName = isString(selector) ? selector : selector[0];
//        this.element = this.component.createElement(elementName);
//      }
//      if (!isString(selector)) {
//        this.element.state = selector[1];
//      }
//    }
//  }
  ngAfterViewInit() {
    this.initUpdater();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('styler dir changes', changes);
    if ('elementName' in changes) {
      console.log('!!! element creation', this.elementName);
      this.element = this.component.createElement(this.elementName);
    }
    if ('state' in changes) {
      console.log('state changes', this.state);
      this.element.state = this.state;
    }
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

  private updateSid(sid: string) {
    // check if changed
    if (this.sid !== sid) {
      // remove prev
      this.renderer.removeClass(this.el.nativeElement, this.sid);
      // add new
      this.sid = sid;
      this.renderer.addClass(this.el.nativeElement, this.sid);
    }
  }
}
