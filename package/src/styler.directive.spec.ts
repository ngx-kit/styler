import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StylerComponent } from './styler-component';
import { StylerDirective } from './styler.directive';

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

class StylerComponentMock {
  elements = [];

  createElement(name: string) {
    const element = {
      name,
      sid: 'sid',
      state: {},
      destroy() {
      },
    };
    this.elements.push(element);
    return element;
  }
}

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
    expect(styledDiv.attributes['sid-sid']).toBeDefined();
  });
  it('state should be proxied to the service', () => {
    container.complexState = 'new';
    fixture.detectChanges();
    expect(service.elements[1].state).toBe('new');
  });
  it('[sid] should be updated after state change', () => {
    fixture.detectChanges();
    service.elements[1].sid = 'updated';
    container.complexState = 'new';
    fixture.detectChanges();
    const styledDiv = de.query(By.css('#complex'));
    expect(styledDiv.attributes['sid-sid']).toBeNull();
    expect(styledDiv.attributes['sid-updated']).toBeDefined();
  });
  it('[sid] should not be updated before state change', () => {
    fixture.detectChanges();
    service.elements[1].sid = 'updated';
    fixture.detectChanges();
    const styledDiv = de.query(By.css('#complex'));
    expect(styledDiv.attributes['sid-sid']).toBeDefined();
    expect(styledDiv.attributes['sid-updated']).toBeUndefined();
  });
});
