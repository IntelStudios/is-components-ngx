import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoInputMappingComponent } from './demo-input-mapping/demo-input-mapping.component';
import { RouterModule, Routes } from '@angular/router';
import { IsInputMappingModule } from 'projects/is-input-mapping/src/public_api';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DemoInputMappingComponent],
  imports: [
    CommonModule,
    IsInputMappingModule,
    ReactiveFormsModule
  ]
})
export class DemoInputMappingModule { }

const routes: Routes = [
  { path: '', component: DemoInputMappingComponent }
];

@NgModule({
  imports: [DemoInputMappingModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoInputMappingRoutingModule { }
