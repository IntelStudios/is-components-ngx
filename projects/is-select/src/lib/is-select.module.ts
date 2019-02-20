import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IsSelectComponent } from './is-select.component';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from './is-select.directives';
import { HighlightPipe } from './select-pipes';
import { IsSelectColorComponent } from './is-select-color.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective, IsSelectColorComponent],
  exports: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective, IsSelectColorComponent]
})
export class IsSelectModule { }
