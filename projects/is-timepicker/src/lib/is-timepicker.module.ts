import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { IsTimepickerComponent } from './is-timepicker.component';

@NgModule({
  imports: [
    CommonModule, TimepickerModule.forRoot(), FormsModule
  ],
  declarations: [IsTimepickerComponent],
  exports: [IsTimepickerComponent]
})
export class IsTimepickerModule { }
