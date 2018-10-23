import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsSelectComponent } from './is-select.component';
import { HighlightPipe } from './select-pipes';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from './is-select.directives';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective],
  exports: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective, IsSelectOptionSelectedDirective]
})
export class IsSelectModule { }
