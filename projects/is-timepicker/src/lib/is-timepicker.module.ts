import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { IsTimepickerComponent } from './is-timepicker.component';
import { IsTimepickerPickerComponent } from './is-timepicker-picker.component';

@NgModule({
  imports: [
    CommonModule, OverlayModule, TimepickerModule.forRoot(), FormsModule
  ],
  declarations: [IsTimepickerComponent, IsTimepickerPickerComponent],
  exports: [IsTimepickerComponent],
  entryComponents: [IsTimepickerPickerComponent]
})
export class IsTimepickerModule { }
