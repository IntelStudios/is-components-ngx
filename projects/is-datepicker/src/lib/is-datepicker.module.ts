import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDatepickerComponent } from './is-datepicker/is-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { IsDatepickerPopupComponent } from './is-datepicker-popup/is-datepicker-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule, BsDatepickerModule, FormsModule, OverlayModule
  ],
  declarations: [IsDatepickerComponent, IsDatepickerPopupComponent],
  exports: [IsDatepickerComponent],
  entryComponents: [IsDatepickerPopupComponent]
})
export class IsDatepickerModule { }
