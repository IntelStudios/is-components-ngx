import { NgModule } from '@angular/core';
import { IsInputMappingComponent } from './components/input-mapping/is-input-mapping.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IsFilterEditorComponent } from './components/filter-editor/is-filter-editor.component';
import { IsAssignedFilterComponent } from './components/assigned-filter/is-assigned-filter.component';
import { IsDatepickerModule } from '@intelstudios/datepicker';
import { IsInputMappingFilterValue } from './pipes/filter-value-format.pipe';

@NgModule({
  declarations: [
    IsInputMappingComponent,
    IsFilterEditorComponent,
    IsAssignedFilterComponent,
    IsInputMappingFilterValue,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IsDatepickerModule,
  ],
  exports: [IsInputMappingComponent]
})
export class IsInputMappingModule { }
