import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IsSelectpickerComponent } from './is-selectpicker.component';

@NgModule({
  imports: [
    CommonModule, BsDropdownModule.forRoot(), ReactiveFormsModule
  ],
  declarations: [IsSelectpickerComponent],
  exports: [IsSelectpickerComponent]
})
export class IsSelectpickerModule { }
