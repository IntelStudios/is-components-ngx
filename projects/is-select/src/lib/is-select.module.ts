import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IsSelectBadgeComponent } from './is-select-badge/is-select-badge.component';
import { IsSelectColorComponent } from './is-select-color/is-select-color.component';
import { IsSelectOptionsComponent } from './is-select-options/is-select-options.component';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from './is-select.directives';
import { IsSelectComponent } from './is-select/is-select.component';
import { HighlightPipe } from './select-pipes';
import { IsCoreUIModule } from '@intelstudios/core-ui';
import { IsSelectOptionComponent } from './is-select-option/is-select-option.component';
import { IsSelectConfig, configToken, createDefaultConfig } from './is-select.interfaces';
import { IsCdkModule } from '@intelstudios/cdk';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    IsCoreUIModule,
    ScrollingModule,
    IsCdkModule,
    TranslateModule,
  ],
  declarations: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective, IsSelectColorComponent, IsSelectBadgeComponent, IsSelectOptionsComponent, IsSelectOptionComponent],
  exports: [ScrollingModule, IsSelectComponent, IsSelectOptionDirective, IsSelectOptionSelectedDirective, IsSelectColorComponent, IsSelectBadgeComponent]
})
export class IsSelectModule {
  static forRoot(config?: IsSelectConfig): ModuleWithProviders<IsSelectModule> {
    return {
      ngModule: IsSelectModule,
      providers: [
        { provide: configToken, useValue: { ...createDefaultConfig(), ...config } },
      ]
    }
  }
}
