import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { IsSelectModule } from 'is-select';
import { IIsGridConfig } from './is-grid.interfaces';
import { IsGridComponent, configToken } from './is-grid/is-grid.component';
import { IsGridRowComponent } from './is-grid-row/is-grid-row.component';

@NgModule({
  imports: [
    CommonModule, TranslateModule, IsSelectModule, BsDropdownModule, ReactiveFormsModule, FormsModule,
    PaginationModule
  ],
  declarations: [IsGridComponent, IsGridRowComponent],
  exports: [IsGridComponent]
})
export class IsGridModule {
  static forRoot(config: IIsGridConfig): ModuleWithProviders<IsGridModule> {
    return {
      ngModule: IsGridModule,
      providers: [
        { provide: configToken, useValue: config }
      ]
    }
  }
 }
