import { NgModule } from '@angular/core';
import { IsCronEditorComponent } from './is-cron-editor.component';
import { IsCoreUIModule } from '@intelstudios/core-ui';
import { IsSelectModule } from '@intelstudios/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IsCronEditorComponent],
  imports: [
    IsCoreUIModule,
    ReactiveFormsModule,
    CommonModule,
    IsSelectModule,
  ],
  exports: [IsCronEditorComponent]
})
export class IsCronEditorModule { }
