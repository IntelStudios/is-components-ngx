import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsSelectpickerModule } from 'projects/is-selectpicker/src/public_api';

import { DemoSelectpickerComponent } from './demo-selectpicker/demo-selectpicker.component';


@NgModule({
  declarations: [DemoSelectpickerComponent],
  imports: [
    CommonModule, IsSelectpickerModule, ReactiveFormsModule
  ]
})
export class DemoSelectpickerModule { }

const routes: Routes = [
  { path: '', component: DemoSelectpickerComponent }
];

@NgModule({
  imports: [DemoSelectpickerModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoSelectpickerRoutingModule { }

