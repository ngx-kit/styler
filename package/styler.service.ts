import { Injectable } from '@angular/core';
import { style as s } from 'typestyle';

@Injectable()
export class StylerService {

  styles: any;

  register(styles: any) {
    this.styles = styles;
  }

  getHostClass() {
    return this.getByName('host');
  }

  getByName(name: any) {
    if (this.styles[name]) {
      return s(this.styles[name]);
    } else {
      throw new Error(`Styler: component does not have "${name}" property!`);
    }
  }

}
