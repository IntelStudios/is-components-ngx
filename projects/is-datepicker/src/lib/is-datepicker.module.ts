import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDatepickerComponent } from './is-datepicker/is-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, BsDatepickerModule, FormsModule
  ],
  declarations: [IsDatepickerComponent],
  exports: [IsDatepickerComponent]
})
export class IsDatepickerModule { }
