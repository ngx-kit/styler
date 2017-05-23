import { NgModule } from '@angular/core';

import { StylerDirective } from './styler.directive';

const external = [
  StylerDirective,
];

@NgModule({
  imports: [],
  exports: external,
  declarations: [
    ...external,
  ],
  providers: []
})
export class StylerModule {
}
