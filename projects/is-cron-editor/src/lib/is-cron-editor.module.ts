import { NgModule } from '@angular/core';
import { IsCronEditorComponent } from './is-cron-editor.component';
import { IsMetronicModule } from 'is-metronic';
import { IsSelectModule } from 'is-select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IsCronEditorComponent],
  imports: [
    IsMetronicModule,
    ReactiveFormsModule,
    CommonModule,
    IsSelectModule
  ],
  exports: [IsCronEditorComponent]
})
export class IsCronEditorModule { }
