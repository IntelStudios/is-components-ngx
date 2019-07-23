import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IsCheckmapModule } from 'projects/is-checkmap/src/public_api';
import { DemoCheckmapComponent } from './demo-checkmap/demo-checkmap.component';

@NgModule({
  declarations: [DemoCheckmapComponent],
  imports: [
    CommonModule, IsCheckmapModule
  ]
})
export class DemoCheckmapModule { }

const routes: Routes = [
  { path: '', component: DemoCheckmapComponent }
];

@NgModule({
  imports: [DemoCheckmapModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoCheckmapRoutingModule { }
