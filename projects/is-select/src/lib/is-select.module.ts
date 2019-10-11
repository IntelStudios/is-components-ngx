import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IsSelectBadgeComponent } from './is-select-badge/is-select-badge.component';
import { IsSelectColorComponent } from './is-select-color/is-select-color.component';
import { IsSelectOptionsComponent } from './is-select-options/is-select-options.component';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from './is-select.directives';
import { IsSelectComponent } from './is-select/is-select.component';
import { HighlightPipe } from './select-pipes';
import { IsCoreUIModule } from 'is-core-ui';

@NgModule({
  imports: [
    CommonModule, OverlayModule, IsCoreUIModule
  ],
  declarations: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective, IsSelectColorComponent, IsSelectBadgeComponent, IsSelectOptionsComponent],
  exports: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective, IsSelectColorComponent, IsSelectBadgeComponent],
  entryComponents: [IsSelectOptionsComponent]
})
export class IsSelectModule { }
