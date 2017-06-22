import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StylerDirective } from './styler.directive';
import { StylerCompilerService } from './compiler/compiler.service';
import { StylerDefaultHashService } from './compiler/default-hash.service';
import { componentStyle, stylerHash } from './meta/tokens';
import { StylerDefService } from './styler-def.service';
import { StylerComponent } from './styler-component';
import { StylerColorService } from './styler-color.service';

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
        StylerCompilerService,
        StylerDefService,
        StylerColorService,
        {
          provide: stylerHash,
          useClass: StylerDefaultHashService,
        },
      ]
    };
  }

  static forComponent(componentStyleClass: any): Provider[] {
    return [
      {
        provide: componentStyle,
        useClass: componentStyleClass,
      },
      StylerComponent,
    ];
  }

}
