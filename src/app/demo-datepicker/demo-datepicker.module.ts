import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsDatepickerModule } from 'projects/is-datepicker/src/public_api';

import { DemoDatepickerComponent } from './demo-datepicker/demo-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IsCoreUIModule } from 'projects/is-core-ui/src/public_api';

@NgModule({
  declarations: [DemoDatepickerComponent],
  imports: [
    CommonModule, IsDatepickerModule, IsCoreUIModule, ReactiveFormsModule, BsDatepickerModule.forRoot()
  ]
})
export class DemoDatepickerModule { }

const routes: Routes = [
  { path: '', component: DemoDatepickerComponent }
];

@NgModule({
  imports: [DemoDatepickerModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoDatepickerRoutingModule { }

