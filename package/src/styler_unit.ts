import { StateSetter } from './interfaces';
import { StylerService } from './styler.service';

export class StylerUnit {

  private state: StateSetter = {};

  constructor(private service: StylerService,
              private elementName: string) {
  }

  setState(setter: StateSetter) {
    this.state = {...this.state, ...setter};
  }

  getClass(): string {
    return this.service.getClass(this.elementName, this.state);
  }

  getElementName(): string {
    return this.elementName;
  }

  hasState(name: string): boolean {
    return this.service.hasState(this.elementName, name);
  }

}