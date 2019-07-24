import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsTableModule } from 'projects/is-table/src/public_api';

import { DemoTableComponent } from './demo-table/demo-table.component';


@NgModule({
  declarations: [DemoTableComponent],
  imports: [
    CommonModule, IsTableModule
  ]
})
export class DemoTableModule { }

const routes: Routes = [
  { path: '', component: DemoTableComponent }
];

@NgModule({
  imports: [DemoTableModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoTableRoutingModule { }

