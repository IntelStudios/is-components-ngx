import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsCdkModule } from 'projects/is-cdk/src/public-api';

import { IsCoreUIModule } from 'projects/is-core-ui/src/public_api';
import { IsFroalaModule } from 'projects/is-froala/src/public_api';

import { DemoFroalaComponent } from './demo-froala/demo-froala.component';

@NgModule({
  declarations: [DemoFroalaComponent],
  imports: [
    CommonModule, IsFroalaModule.forRoot({ getLicense: () => ''}), ReactiveFormsModule, IsCoreUIModule, IsCdkModule,
  ]
})
export class DemoFroalaModule { }

const routes: Routes = [
  { path: '', component: DemoFroalaComponent }
];

@NgModule({
  imports: [DemoFroalaModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoFroalaRoutingModule { }

