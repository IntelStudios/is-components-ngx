import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsDXSelectTreeModule } from 'projects/is-dx-select-tree/src/public_api';

import { DemoDXSelectTreeComponent } from './demo-dx-select-tree/demo-dx-select-tree.component';

@NgModule({
  declarations: [DemoDXSelectTreeComponent],
  imports: [
    CommonModule, IsDXSelectTreeModule
  ]
})
export class DemoDxSelectTreeModule { }

const routes: Routes = [
  { path: '', component: DemoDXSelectTreeComponent }
];

@NgModule({
  imports: [DemoDxSelectTreeModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoDxSelectTreeRoutingModule { }

