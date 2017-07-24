import { Injectable } from '@angular/core';
import { StylerCompilerService } from './compiler/compiler.service';
import { Style } from './meta/style';
import { StylerComponent } from './styler-component';

@Injectable()
export class StylerService {
  private components: Set<StylerComponent> = new Set();

  constructor(private compiler: StylerCompilerService) {
  }

  registerComponent(component: StylerComponent) {
    this.components.add(component);
  }

  setRaw(selector: string, styles: Style) {
    this.compiler.setRaw(selector, styles);
  }

  unregisterComponent(component: StylerComponent) {
    this.components.delete(component);
  }

  updateComponents() {
    // @todo render only once
    this.components.forEach(component => {
      component.update(false);
    });
    this.compiler.render();
  }
}
