import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsSelectTreeModule } from 'projects/is-select-tree/src/public_api';

import { DemoSelectTreeComponent } from './demo-select-tree/demo-select-tree.component';


@NgModule({
  declarations: [DemoSelectTreeComponent],
  imports: [
    CommonModule, IsSelectTreeModule, ReactiveFormsModule
  ]
})
export class DemoSelectTreeModule { }

const routes: Routes = [
  { path: '', component: DemoSelectTreeComponent }
];

@NgModule({
  imports: [DemoSelectTreeModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoSelectTreeRoutingModule { }

