import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StylerComponent } from './styler-component';
import { StylerDirective } from './styler.directive';

@Component({
  selector: 'container',
  template: `
    <div styler="container"></div>
  `,
})
class ContainerComponent {
}

const testSid = 'TEST_SID';

class StylerComponentMock {
  createElement(name: string) {
    return {
      sid: testSid,
      state: {},
      destroy() {
      },
    };
  }
}

describe('StylerDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let container: ContainerComponent;
  let element: Element;
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
    container = fixture.componentInstance; // to access properties and methods
    element = fixture.nativeElement; // to access DOM element
  });
  // specs
  it('container should be created', () => {
    expect(container).toBeTruthy();
  });
  it('styler should set [sid]', () => {
    fixture.detectChanges();
    const styledDiv = fixture.debugElement.query(By.directive(StylerDirective));
    expect(styledDiv.attributes[`sid-${testSid}`]).toBeDefined();
  });
});
