import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsGridModule } from 'projects/is-grid/src/public_api';

import { DemoGridComponent } from './demo-grid/demo-grid.component';


@NgModule({
  declarations: [DemoGridComponent],
  imports: [
    CommonModule, IsGridModule
  ]
})
export class DemoGridModule { }

const routes: Routes = [
  { path: '', component: DemoGridComponent }
];

@NgModule({
  imports: [DemoGridModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoGridRoutingModule { }

