import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { IsSelectModule } from 'is-select';
import { IIsTableConfig } from './is-table.interfaces';
import { IsTableComponent, configToken } from './is-table/is-table.component';
import {
  IsDataTableActionsColumnDirective,
  IsDataTableColumnDirective
} from './is-table.directives';

@NgModule({
  imports: [
    CommonModule, IsSelectModule,TranslateModule, BsDropdownModule, ReactiveFormsModule, FormsModule,
    PaginationModule
  ],
  declarations: [IsTableComponent, IsDataTableColumnDirective, IsDataTableActionsColumnDirective],
  exports: [IsTableComponent, IsDataTableColumnDirective, IsDataTableActionsColumnDirective]
})
export class IsTableModule {
  static forRoot(config: IIsTableConfig): ModuleWithProviders {
    return {
      ngModule: IsTableModule,
      providers: [
        { provide: configToken, useValue: config }
      ]
    }
  }
 }
