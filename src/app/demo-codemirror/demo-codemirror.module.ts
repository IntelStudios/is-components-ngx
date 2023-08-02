import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsCodemirrorModule } from 'projects/is-codemirror/src/public_api';
import { IsCoreUIModule } from 'projects/is-core-ui/src/public_api';

import { DemoCodemirrorComponent } from '../demo-codemirror/demo-codemirror/demo-codemirror.component';


@NgModule({
  declarations: [DemoCodemirrorComponent],
  imports: [
    CommonModule, IsCodemirrorModule, IsCoreUIModule.forRoot(),
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

