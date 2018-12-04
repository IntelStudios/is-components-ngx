import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IsSelectModule } from '../../projects/is-select/src/lib/is-select.module';
import { IsCodemirrorModule } from '../../projects/is-codemirror/src/lib/is-codemirror.module';
import { IsFroalaModule } from '../../projects/is-froala/src/lib/is-froala.module';
import { IsMetronicModule } from '../../projects/is-metronic/src/lib/is-metronic.module';
import { IsDatepickerModule } from '../../projects/is-datepicker/src/lib/is-datepicker.module';
import { IsSelectpickerModule } from '../../projects/is-selectpicker/src/lib/is-selectpicker.module';
import { IsBootstrapSwitchModule } from '../../projects/is-bootstrap-switch/src/lib/is-bootstrap-switch.module';
import { AppComponent } from './app.component';
import { DemoSelectComponent } from './demo-select/demo-select.component';
import { DemoCodemirrorComponent } from './demo-codemirror/demo-codemirror.component';
import { DemoFroalaComponent } from './demo-froala/demo-froala.component';
import { DemoMetronicComponent } from './demo-metronic/demo-metronic.component';
import { DemoDatepickerComponent } from './demo-datepicker/demo-datepicker.component';
import { DemoSelectpickerComponent } from './demo-selectpicker/demo-selectpicker.component';
import { DemoBootstrapSwitchComponent } from './demo-bootstrap-switch/demo-bootstrap-switch.component';

export const routes: Routes = [
  { path: 'select', component: DemoSelectComponent },
  { path: 'selectpicker', component: DemoSelectpickerComponent },
  { path: 'datepicker', component: DemoDatepickerComponent },
  { path: 'codemirror', component: DemoCodemirrorComponent },
  { path: 'froala', component: DemoFroalaComponent },
  { path: 'metronic', component: DemoMetronicComponent },
  { path: 'datepicker', component: DemoDatepickerComponent },
  { path: 'bootstrap-switch', component: DemoBootstrapSwitchComponent }
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
    DemoBootstrapSwitchComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule, FormsModule,
    TranslateModule.forRoot(),
    IsSelectModule, IsCodemirrorModule, IsFroalaModule, IsMetronicModule, IsDatepickerModule,
    IsSelectpickerModule,
    IsBootstrapSwitchModule.forRoot({ onText: 'bs-switch-on', offText: 'bs-switch-off' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
