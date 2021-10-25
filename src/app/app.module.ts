import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from '@circlon/angular-tree-component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AppComponent } from './app.component';
import { IsSelectModule } from 'projects/is-select/src/public_api';


export const routes: Routes = [
  { path: 'select', loadChildren: () => import('./demo-select/demo-select.module').then(m => m.DemoSelectRoutingModule) },
  { path: 'datepicker', loadChildren: () => import('./demo-datepicker/demo-datepicker.module').then(m => m.DemoDatepickerRoutingModule) },
  { path: 'codemirror', loadChildren: () => import('./demo-codemirror/demo-codemirror.module').then(m => m.DemoCodemirrorRoutingModule) },
  { path: 'froala', loadChildren: () => import('./demo-froala/demo-froala.module').then(m => m.DemoFroalaRoutingModule) },
  { path: 'core-ui', loadChildren: () => import('./demo-core-ui/demo-core-ui.module').then(m => m.DemoCoreUIRoutingModule) },
  { path: 'bootstrap-switch', loadChildren: () => import('./demo-bootstrap-switch/demo-bootstrap-switch.module').then(m => m.DemoBootstrapSwitchRoutingModule) },
  { path: 'editable-textbox', loadChildren: () => import('./demo-editable-textbox/demo-editable-textbox.module').then(m => m.DemoEditableTextboxRoutingModule) },
  { path: 'select-tree', loadChildren: () => import('./demo-select-tree/demo-select-tree.module').then(m => m.DemoSelectTreeRoutingModule) },
  { path: 'dx-select-tree', loadChildren: () => import('./demo-dx-select-tree/demo-dx-select-tree.module').then(m => m.DemoDxSelectTreeRoutingModule) },
  { path: 'input-mapping', loadChildren: () => import('./demo-input-mapping/demo-input-mapping.module').then(m => m.DemoInputMappingRoutingModule) },
  { path: 'modal', loadChildren: () => import('./demo-modal/demo-modal.module').then(m => m.DemoModalRoutingModule) },
  { path: 'grid', loadChildren: () => import('./demo-grid/demo-grid.module').then(m => m.DemoGridRoutingModule) },
  { path: 'table', loadChildren: () => import('./demo-table/demo-table.module').then(m => m.DemoTableRoutingModule)},
  { path: 'timepicker', loadChildren: () => import('./demo-timepicker/demo-timepicker.module').then(m => m.DemoTimepickerRoutingModule) },
  { path: 'croneditor', loadChildren: () => import('./demo-cron-editor/demo-cron-editor.module').then(m => m.DemoCronEditorRoutingModule) },
  { path: 'checkmap', loadChildren: () => import('./demo-checkmap/demo-checkmap.module').then(m => m.DemoCheckmapRoutingModule) }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' }),
    TreeModule,
    ReactiveFormsModule, FormsModule,
    TranslateModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    // IsSelectModule.forRoot({ optionsOverflowWidth: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
