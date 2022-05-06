import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsModalModule } from 'projects/is-modal/src/public_api';

import { DemoModalComponent } from './demo-modal/demo-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DemoModalMovableComponent } from './demo-modal/demo-modal-movable.component';

@NgModule({
    declarations: [DemoModalComponent, DemoModalMovableComponent],
    imports: [
        CommonModule, IsModalModule, ModalModule.forRoot()
    ]
})
export class DemoModalModule { }

const routes: Routes = [
  { path: '', component: DemoModalComponent }
];

@NgModule({
  imports: [DemoModalModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoModalRoutingModule { }

