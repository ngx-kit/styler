import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StylerDirective } from './styler.directive';
import { StylerCompilerService } from './compiler/compiler.service';
import { StylerDefaultHashService } from './compiler/default-hash.service';
import { componentStyle, stylerHash } from './meta/tokens';
import { StylerService } from './styler.service';
import { StylerComponent } from './styler-component';

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
