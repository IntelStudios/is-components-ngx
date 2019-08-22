import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'angular-tree-component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AppComponent } from './app.component';


export const routes: Routes = [
  { path: 'select', loadChildren: './demo-select/demo-select.module#DemoSelectRoutingModule' },
  { path: 'datepicker', loadChildren: './demo-datepicker/demo-datepicker.module#DemoDatepickerRoutingModule' },
  { path: 'codemirror', loadChildren: './demo-codemirror/demo-codemirror.module#DemoCodemirrorRoutingModule' },
  { path: 'froala', loadChildren: './demo-froala/demo-froala.module#DemoFroalaRoutingModule' },
  { path: 'metronic', loadChildren: './demo-metronic/demo-metronic.module#DemoMetronicRoutingModule' },
  { path: 'bootstrap-switch', loadChildren: './demo-bootstrap-switch/demo-bootstrap-switch.module#DemoBootstrapSwitchRoutingModule' },
  { path: 'password', loadChildren: './demo-password/demo-password.module#DemoPasswordRoutingModule' },
  { path: 'select-tree', loadChildren: './demo-select-tree/demo-select-tree.module#DemoSelectTreeRoutingModule' },
  { path: 'dx-select-tree', loadChildren: './demo-dx-select-tree/demo-dx-select-tree.module#DemoDxSelectTreeRoutingModule' },
  { path: 'modal', loadChildren: './demo-modal/demo-modal.module#DemoModalRoutingModule' },
  { path: 'grid', loadChildren: './demo-grid/demo-grid.module#DemoGridRoutingModule' },
  { path: 'table', loadChildren: './demo-table/demo-table.module#DemoTableRoutingModule'},
  { path: 'timepicker', loadChildren: './demo-timepicker/demo-timepicker.module#DemoTimepickerRoutingModule' },
  { path: 'croneditor', loadChildren: './demo-cron-editor/demo-cron-editor.module#DemoCronEditorRoutingModule' },
  { path: 'checkmap', loadChildren: './demo-checkmap/demo-checkmap.module#DemoCheckmapRoutingModule' }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    TreeModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    TranslateModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
