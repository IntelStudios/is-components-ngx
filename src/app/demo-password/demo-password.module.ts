import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsPasswordModule } from 'projects/is-password/src/public_api';

import { DemoPasswordComponent } from './demo-password/demo-password.component';


@NgModule({
  declarations: [DemoPasswordComponent],
  imports: [
    CommonModule, IsPasswordModule, ReactiveFormsModule
  ]
})
export class DemoPasswordModule { }

const routes: Routes = [
  { path: '', component: DemoPasswordComponent }
];

@NgModule({
  imports: [DemoPasswordModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoPasswordRoutingModule { }

