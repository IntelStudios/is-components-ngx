import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsCodemirrorModule } from 'projects/is-codemirror/src/public_api';

import { DemoCodemirrorComponent } from '../demo-codemirror/demo-codemirror/demo-codemirror.component';


@NgModule({
  declarations: [DemoCodemirrorComponent],
  imports: [
    CommonModule, IsCodemirrorModule
  ]
})
export class DemoCodemirrorModule { }

const routes: Routes = [
  { path: '', component: DemoCodemirrorComponent }
];

@NgModule({
  imports: [DemoCodemirrorModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoCodemirrorRoutingModule { }

