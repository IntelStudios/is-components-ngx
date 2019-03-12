import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { IsSelectpickerOptionDirective, IsSelectpickerOptionSelectedDirective } from './is-selectpicker.directives';
import { IsSelectpickerComponent } from './is-selectpicker.component';

@NgModule({
  imports: [
    CommonModule, BsDropdownModule.forRoot(), ReactiveFormsModule
  ],
  declarations: [IsSelectpickerComponent, IsSelectpickerOptionDirective, IsSelectpickerOptionSelectedDirective],
  exports: [IsSelectpickerComponent, IsSelectpickerOptionDirective, IsSelectpickerOptionSelectedDirective]
})
export class IsSelectpickerModule { }
