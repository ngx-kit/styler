import { StateSetter } from '../meta/state';

export abstract class ClassGenStategy {
  abstract gen(classPrefix: string, elementName: string, state: StateSetter): Set<string>;
}
