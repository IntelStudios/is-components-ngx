import { NgModule } from '@angular/core';
import { IsEditableTextboxComponent } from './is-editable-textbox.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IsEditableTextboxComponent],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [IsEditableTextboxComponent]
})
export class IsEditableTextboxModule { }
