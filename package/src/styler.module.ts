import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StylerDirective } from './styler.directive';
import { StylerCompilerService } from './compiler/compiler.service';
import { StylerDefaultHashService } from './compiler/default-hash.service';
import { stylerHash } from './meta/tokens';
import { StylerService } from './styler.service';

const exported = [
  StylerDirective,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ...exported,
  ],
  declarations: [
    ...exported,
  ],
  providers: []
})
export class StylerModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StylerModule,
      providers: [
        StylerService,
        StylerCompilerService,
        {
          provide: stylerHash,
          useClass: StylerDefaultHashService,
        },
      ]
    };
  }

}
