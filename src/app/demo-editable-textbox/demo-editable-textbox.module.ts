import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoEditableTextboxComponent } from './demo-editable-textbox/demo-editable-textbox.component';
import { IsEditableTextboxModule } from 'projects/is-editable-textbox/src/public_api';
import { RouterModule, Routes } from '@angular/router';
import { DemoCronEditorModule } from '../demo-cron-editor/demo-cron-editor.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DemoEditableTextboxComponent],
  imports: [
    CommonModule,
    IsEditableTextboxModule,
    ReactiveFormsModule
  ]
})
export class DemoEditableTextboxModule { }

const routes: Routes = [
  { path: '', component: DemoEditableTextboxComponent }
];

@NgModule({
  imports: [DemoEditableTextboxModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoEditableTextboxRoutingModule { }

