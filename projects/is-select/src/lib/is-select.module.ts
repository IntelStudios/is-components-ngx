import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IsSelectComponent } from './is-select.component';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from './is-select.directives';
import { HighlightPipe } from './select-pipes';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective],
  exports: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective]
})
export class IsSelectModule { }
