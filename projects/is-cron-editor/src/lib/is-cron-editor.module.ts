import { NgModule } from '@angular/core';
import { IsCronEditorComponent } from './is-cron-editor.component';
import {IsMetronicModule} from 'is-metronic';
import {IsSelectModule} from 'is-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IsSelectpickerModule} from 'is-selectpicker';

@NgModule({
  declarations: [IsCronEditorComponent],
  imports: [
    IsMetronicModule,
    IsSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IsSelectpickerModule,
    IsSelectModule,
    IsSelectpickerModule,
    IsSelectModule
  ],
  exports: [IsCronEditorComponent]
})
export class IsCronEditorModule { }
