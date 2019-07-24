import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsDatepickerModule } from 'projects/is-datepicker/src/public_api';

import { DemoDatepickerComponent } from './demo-datepicker/demo-datepicker.component';

@NgModule({
  declarations: [DemoDatepickerComponent],
  imports: [
    CommonModule, IsDatepickerModule, ReactiveFormsModule
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

