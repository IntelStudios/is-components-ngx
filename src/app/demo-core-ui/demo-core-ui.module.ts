import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemoCoreUIComponent } from './demo-core-ui/demo-core-ui.component';
import { IsCoreUIModule } from 'projects/is-core-ui/src/public_api';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { IsDatepickerModule } from 'projects/is-datepicker/src/public_api';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IsTimepickerModule } from 'projects/is-timepicker/src/public_api';
import { IsSelectModule } from 'projects/is-select/src/public_api';
import { IsCdkModule } from 'projects/is-cdk/src/public-api';

@NgModule({
  declarations: [DemoCoreUIComponent],
  imports: [
    IsCdkModule,
    CommonModule, IsCoreUIModule.forRoot(),
    IsDatepickerModule, BsDatepickerModule.forRoot(),
    IsSelectModule, IsTimepickerModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    RouterModule
  ]
})
export class DemoCoreUIModule { }

const routes: Routes = [
  { path: '', component: DemoCoreUIComponent }
];

@NgModule({
  imports: [DemoCoreUIModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoCoreUIRoutingModule { }

