import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDatepickerComponent } from './is-datepicker/is-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { IsDatepickerPopupComponent } from './is-datepicker-popup/is-datepicker-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IsDatepickerInlineComponent } from './is-datepicker-inline/is-datepicker-inline.component';

@NgModule({
  imports: [
    CommonModule, BsDatepickerModule, FormsModule, OverlayModule, ScrollingModule
  ],
  declarations: [IsDatepickerComponent, IsDatepickerPopupComponent, IsDatepickerInlineComponent],
  exports: [IsDatepickerComponent, IsDatepickerInlineComponent],
  entryComponents: [IsDatepickerPopupComponent]
})
export class IsDatepickerModule { }
