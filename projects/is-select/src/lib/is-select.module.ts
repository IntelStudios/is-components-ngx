import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsSelectComponent } from './is-select.component';
import { HighlightPipe } from './select-pipes';
import { IsSelectOptionDirective } from './is-select.directives';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective],
  exports: [IsSelectComponent, HighlightPipe, IsSelectOptionDirective]
})
export class IsSelectModule { }
