import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'angular-tree-component';

import { IsSelectModule } from 'projects/is-select/src/public_api';
import { IsCodemirrorModule } from 'projects/is-codemirror/src/public_api';
import { IsFroalaModule } from 'projects/is-froala/src/public_api';
import { IsMetronicModule } from 'projects/is-metronic/src/public_api';
import { IsDatepickerModule } from 'projects/is-datepicker/src/public_api';
import { IsSelectpickerModule } from 'projects/is-selectpicker/src/public_api';
import { IsBootstrapSwitchModule } from 'projects/is-bootstrap-switch/src/public_api';
import { IsPasswordModule } from 'projects/is-password/src/public_api';
import { IsSelectTreeModule } from 'projects/is-select-tree/src/public_api';


import { AppComponent } from './app.component';
import { DemoSelectComponent } from './demo-select/demo-select.component';
import { DemoCodemirrorComponent } from './demo-codemirror/demo-codemirror.component';
import { DemoFroalaComponent } from './demo-froala/demo-froala.component';
import { DemoMetronicComponent } from './demo-metronic/demo-metronic.component';
import { DemoDatepickerComponent } from './demo-datepicker/demo-datepicker.component';
import { DemoSelectpickerComponent } from './demo-selectpicker/demo-selectpicker.component';
import { DemoBootstrapSwitchComponent } from './demo-bootstrap-switch/demo-bootstrap-switch.component';
import { DemoPasswordComponent } from './demo-password/demo-password.component';
import { DemoSelectTreeComponent } from './demo-select-tree/demo-select-tree.component';

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
  { path: 'select-tree', component: DemoSelectTreeComponent }
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
    DemoSelectTreeComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    TreeModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    TranslateModule.forRoot(),
    IsSelectModule, IsCodemirrorModule, IsFroalaModule,
    IsMetronicModule.forRoot({ placement: 'right', triggers: 'click', outsideClick: true, container: 'body' }, { container: 'body', placement: 'right', triggers: 'click'}),
    IsDatepickerModule,
    IsSelectpickerModule,
    IsBootstrapSwitchModule.forRoot({ onText: 'bs-switch-on', offText: 'bs-switch-off' }),
    IsPasswordModule,
    IsSelectTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
