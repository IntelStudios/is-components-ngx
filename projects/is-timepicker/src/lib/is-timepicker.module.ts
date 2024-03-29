import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsCdkModule } from '@intelstudios/cdk';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaskModule } from 'ngx-mask';

import { IsTimepickerPickerComponent } from './is-timepicker-picker.component';
import { IsTimepickerComponent } from './is-timepicker.component';

@NgModule({
    imports: [
        CommonModule, OverlayModule, TimepickerModule.forRoot(), FormsModule, ScrollingModule, ReactiveFormsModule, NgxMaskModule.forRoot(), IsCdkModule,
    ],
    declarations: [IsTimepickerComponent, IsTimepickerPickerComponent],
    exports: [IsTimepickerComponent]
})
export class IsTimepickerModule { }
