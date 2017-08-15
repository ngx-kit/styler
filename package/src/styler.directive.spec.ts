import { Component, DebugElement, Injectable } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CompilerService } from './compiler/compiler.service';
import { StyleDef } from './meta/def';
import { StylerComponent } from './styler-component';
import { StylerDirective } from './styler.directive';

describe('StylerDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let container: ContainerComponent;
  let element: Element;
  let de: DebugElement;
  let service: StylerComponentMock;
  // setup
  beforeEach(async(() => {
    TestBed.configureTestingModule({
          declarations: [ContainerComponent, StylerDirective],
          providers: [
            {
              provide: StylerComponent,
              useClass: StylerComponentMock,
            },
            {
              provide: CompilerService,
              useClass: CompilerServiceMock,
            },
          ],
        })
        .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    container = fixture.componentInstance;
    element = fixture.nativeElement;
    de = fixture.debugElement;
  });
  beforeEach(inject([StylerComponent], (serviceMock: StylerComponentMock) => {
    service = serviceMock;
  }));
  // specs
  it('container should be created', () => {
    expect(container).toBeTruthy();
  });
  // @todo should pass name & state
  it('should pass elementName to the service', () => {
    fixture.detectChanges();
    expect(service.elements[0].name).toBe('basic');
    expect(service.elements[1].name).toBe('complex');
  });
  it('[sid] should be setted', () => {
    fixture.detectChanges();
    const styledDiv = de.query(By.css('#basic'));
    expect(styledDiv.attributes['sid-red']).toBeDefined();
  });
  it('state should be proxied to the service', () => {
    container.complexState = 'new';
    fixture.detectChanges();
    expect(service.elements[1].state).toBe('new');
  });
  it('[sid] should be updated after state change', () => {
    fixture.detectChanges();
    service.elements[1].def$.next({background: 'blue'});
    container.complexState = 'new';
    fixture.detectChanges();
    const styledDiv = de.query(By.css('#complex'));
    expect(styledDiv.attributes['sid-red']).toBeNull();
    expect(styledDiv.attributes['sid-blue']).toBeDefined();
  });
});

@Component({
  selector: 'container',
  template: `
    <div id="basic" styler="basic"></div>
    <div id="complex" [styler]="['complex', complexState]"></div>
  `,
})
class ContainerComponent {
  complexState = 'default';
}

@Injectable()
class StylerComponentMock {
  elements: any[] = [];

  createElement(name: string) {
    const element = {
      name,
      def$: new BehaviorSubject<StyleDef>({background: 'red'}),
      classes$: new BehaviorSubject<Set<string>>(new Set()),
      state: {},
      destroy: () => {
      },
    };
    this.elements.push(element);
    return element;
  }

  setElClasses() {
  }
}

@Injectable()
class CompilerServiceMock {
  renderElement(def: any) {
    return `sid-${def.background}`;
  }
}
