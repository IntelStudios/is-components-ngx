import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DemoMetronicComponent } from './demo-metronic/demo-metronic.component';
import { IsMetronicModule } from 'projects/is-metronic/src/public_api';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [DemoMetronicComponent],
  imports: [
    CommonModule, IsMetronicModule.forRoot({ placement: 'right', triggers: 'click', outsideClick: true, container: 'body' }, {
      delay: 3000,
      container: 'body',
      placement: 'right',
      triggers: 'click'
    }),
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    RouterModule
  ]
})
export class DemoMetronicModule { }

const routes: Routes = [
  { path: '', component: DemoMetronicComponent }
];

@NgModule({
  imports: [DemoMetronicModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoMetronicRoutingModule { }

