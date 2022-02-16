import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsCoreUIModule } from 'projects/is-core-ui/src/public_api';
import { IsTimepickerModule } from 'projects/is-timepicker/src/public_api';

import { DemoTimepickerComponent } from './demo-timepicker/demo-timepicker.component';


@NgModule({
  declarations: [DemoTimepickerComponent],
  imports: [
    CommonModule, IsTimepickerModule, IsCoreUIModule, ReactiveFormsModule
  ]
})
export class DemoTimepickerModule { }

const routes: Routes = [
  { path: '', component: DemoTimepickerComponent }
];

@NgModule({
  imports: [DemoTimepickerModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoTimepickerRoutingModule { }
