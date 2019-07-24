import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsSelectModule } from 'projects/is-select/src/public_api';

import { DemoSelectComponent } from './demo-select/demo-select.component';


@NgModule({
  declarations: [DemoSelectComponent],
  imports: [
    CommonModule, IsSelectModule, ReactiveFormsModule
  ]
})
export class DemoSelectModule { }

const routes: Routes = [
  { path: '', component: DemoSelectComponent }
];

@NgModule({
  imports: [DemoSelectModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoSelectRoutingModule { }

