import { NgModule } from '@angular/core';
import { IsInputMappingComponent } from './is-input-mapping.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [IsInputMappingComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
  exports: [IsInputMappingComponent]
})
export class IsInputMappingModule { }
