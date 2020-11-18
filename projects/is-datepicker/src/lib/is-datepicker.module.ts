import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { IsDatepickerInlineComponent } from './is-datepicker-inline/is-datepicker-inline.component';
import { IsDatepickerPopupComponent } from './is-datepicker-popup/is-datepicker-popup.component';
import { IsDatepickerComponent } from './is-datepicker/is-datepicker.component';

@NgModule({
  imports: [
    CommonModule, BsDatepickerModule, FormsModule, OverlayModule, ScrollingModule, ReactiveFormsModule,
  ],
  declarations: [IsDatepickerComponent, IsDatepickerPopupComponent, IsDatepickerInlineComponent],
  exports: [IsDatepickerComponent, IsDatepickerInlineComponent],
  entryComponents: [IsDatepickerPopupComponent]
})
export class IsDatepickerModule { }
