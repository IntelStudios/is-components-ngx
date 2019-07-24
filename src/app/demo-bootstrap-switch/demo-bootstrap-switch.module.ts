import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IsBootstrapSwitchModule } from 'projects/is-bootstrap-switch/src/public_api';
import { IsMetronicModule } from 'projects/is-metronic/src/public_api';
import { IsModalModule } from 'projects/is-modal/src/public_api';

import { DemoBootstrapSwitchComponent } from './demo-bootstrap-switch/demo-bootstrap-switch.component';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [DemoBootstrapSwitchComponent],
  imports: [
    CommonModule,
    IsBootstrapSwitchModule.forRoot({ onText: 'bs-switch-on', offText: 'bs-switch-off' }),
    ReactiveFormsModule,
    IsModalModule,
    IsMetronicModule,
    ModalModule.forRoot()
  ]
})
export class DemoBootstrapSwitchModule { }

const routes: Routes = [
  { path: '', component: DemoBootstrapSwitchComponent }
];

@NgModule({
  imports: [DemoBootstrapSwitchModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoBootstrapSwitchRoutingModule { }

