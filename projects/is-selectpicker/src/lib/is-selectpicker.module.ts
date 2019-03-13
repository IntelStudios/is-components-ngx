import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { IsSelectpickerOptionDirective, IsSelectpickerOptionSelectedDirective } from './is-selectpicker.directives';
import { IsSelectpickerComponent } from './is-selectpicker.component';
import { IsSelectpickerBadgeComponent } from './is-selectpicker-badge.component';

@NgModule({
  imports: [
    CommonModule, BsDropdownModule.forRoot(), ReactiveFormsModule
  ],
  declarations: [IsSelectpickerComponent, IsSelectpickerBadgeComponent, IsSelectpickerOptionDirective, IsSelectpickerOptionSelectedDirective],
  exports: [IsSelectpickerComponent, IsSelectpickerBadgeComponent, IsSelectpickerOptionDirective, IsSelectpickerOptionSelectedDirective]
})
export class IsSelectpickerModule { }
