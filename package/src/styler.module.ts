import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ClassGenStategy } from './class-gen/class-gen-stategy';
import { NoopClassGenStrategy } from './class-gen/noop-class-gen-strategy';
import { CompilerService } from './compiler/compiler.service';
import { DefaultHashStrategy } from './compiler/hash/default-hash-strategy';
import { HashStrategy } from './compiler/hash/hash-strategy';
import { componentStyle } from './meta/tokens';
import { StylerColorService } from './styler-color.service';
import { StylerComponent } from './styler-component';
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
        StylerColorService,
        {
          provide: HashStrategy,
          useClass: DefaultHashStrategy,
        },
        {
          provide: ClassGenStategy,
          useClass: NoopClassGenStrategy,
        },
      ],
    };
  }
}
