import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ClassGenStategy } from './class-gen/class-gen-stategy';
import { NoopClassGenStrategy } from './class-gen/noop-class-gen-strategy';
import { CompilerService } from './compiler/compiler.service';
import { StylerDefaultHashService } from './compiler/default-hash.service';
import { componentStyle, stylerHash } from './meta/tokens';
import { StylerColorService } from './styler-color.service';
import { StylerComponent } from './styler-component';
import { StylerDefService } from './styler-def.service';
import { StylerDirective } from './styler.directive';
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
  providers: [],
})
export class StylerModule {
  static forComponent(componentStyleClass: any): Provider[] {
    return [
      {
        provide: componentStyle,
        useClass: componentStyleClass,
      },
      StylerComponent,
    ];
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StylerModule,
      providers: [
        StylerService,
        CompilerService,
        StylerDefService,
        StylerColorService,
        {
          provide: stylerHash,
          useClass: StylerDefaultHashService,
        },
        {
          provide: ClassGenStategy,
          useClass: NoopClassGenStrategy,
        },
      ],
    };
  }
}
