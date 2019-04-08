import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'angular-tree-component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { IsBootstrapSwitchModule } from 'projects/is-bootstrap-switch/src/public_api';
import { IsCodemirrorModule } from 'projects/is-codemirror/src/public_api';
import { IsDatepickerModule } from 'projects/is-datepicker/src/public_api';
import { IsFroalaModule } from 'projects/is-froala/src/public_api';
import { IsGridModule } from 'projects/is-grid/src/public_api';
import { IsTableModule } from 'projects/is-table/src/public_api';
import { IsMetronicModule } from 'projects/is-metronic/src/public_api';
import { IsModalModule } from 'projects/is-modal/src/public_api';
import { IsPasswordModule } from 'projects/is-password/src/public_api';
import { IsSelectTreeModule } from 'projects/is-select-tree/src/public_api';
import { IsSelectModule } from 'projects/is-select/src/public_api';
import { IsSelectpickerModule } from 'projects/is-selectpicker/src/public_api';
import { IsTimepickerModule } from 'projects/is-timepicker/src/lib/is-timepicker.module';

import { AppComponent } from './app.component';
import { DemoBootstrapSwitchComponent } from './demo-bootstrap-switch/demo-bootstrap-switch.component';
import { DemoCodemirrorComponent } from './demo-codemirror/demo-codemirror.component';
import { DemoDatepickerComponent } from './demo-datepicker/demo-datepicker.component';
import { DemoFroalaComponent } from './demo-froala/demo-froala.component';
import { DemoGridComponent } from './demo-grid/demo-grid.component';
import { DemoTableComponent } from './demo-table/demo-table.component';
import { DemoMetronicComponent } from './demo-metronic/demo-metronic.component';
import { DemoModalComponent } from './demo-modal/demo-modal.component';
import { DemoPasswordComponent } from './demo-password/demo-password.component';
import { DemoSelectTreeComponent } from './demo-select-tree/demo-select-tree.component';
import { DemoSelectComponent } from './demo-select/demo-select.component';
import { DemoSelectpickerComponent } from './demo-selectpicker/demo-selectpicker.component';
import { DemoTimepickerComponent } from './demo-timepicker/demo-timepicker.component';

export const routes: Routes = [
  { path: 'select', component: DemoSelectComponent },
  { path: 'selectpicker', component: DemoSelectpickerComponent },
  { path: 'datepicker', component: DemoDatepickerComponent },
  { path: 'codemirror', component: DemoCodemirrorComponent },
  { path: 'froala', component: DemoFroalaComponent },
  { path: 'metronic', component: DemoMetronicComponent },
  { path: 'datepicker', component: DemoDatepickerComponent },
  { path: 'bootstrap-switch', component: DemoBootstrapSwitchComponent },
  { path: 'password', component: DemoPasswordComponent },
  { path: 'select-tree', component: DemoSelectTreeComponent },
  { path: 'modal', component: DemoModalComponent },
  { path: 'grid', component: DemoGridComponent },
  { path: 'table', component: DemoTableComponent },
  { path: 'timepicker', component: DemoTimepickerComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DemoSelectComponent,
    DemoCodemirrorComponent,
    DemoFroalaComponent,
    DemoMetronicComponent,
    DemoDatepickerComponent,
    DemoSelectpickerComponent,
    DemoBootstrapSwitchComponent,
    DemoPasswordComponent,
    DemoSelectTreeComponent,
    DemoModalComponent,
    DemoGridComponent,
    DemoTableComponent,
    DemoTimepickerComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    TreeModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    TranslateModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    IsSelectModule, IsCodemirrorModule, IsFroalaModule,
    IsMetronicModule.forRoot({ placement: 'right', triggers: 'click', outsideClick: true, container: 'body' }, { delay: 3000, container: 'body', placement: 'right', triggers: 'click'}),
    IsDatepickerModule,
    IsSelectpickerModule,
    IsBootstrapSwitchModule.forRoot({ onText: 'bs-switch-on', offText: 'bs-switch-off' }),
    IsPasswordModule,
    IsSelectTreeModule,
    IsModalModule,
    IsGridModule,
    IsTableModule,
    IsTimepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
