import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsCronEditorModule } from 'projects/is-cron-editor/src/public_api';

import { DemoCronEditorComponent } from './demo-cron-editor/demo-cron-editor.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DemoCronEditorComponent],
  imports: [
    CommonModule, IsCronEditorModule, ReactiveFormsModule
  ]
})
export class DemoCronEditorModule { }

const routes: Routes = [
  { path: '', component: DemoCronEditorComponent }
];

@NgModule({
  imports: [DemoCronEditorModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoCronEditorRoutingModule { }

