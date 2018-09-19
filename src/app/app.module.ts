import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsSelectModule } from '../../projects/is-select/src/lib/is-select.module';
import { IsCodemirrorModule } from '../../projects/is-codemirror/src/lib/is-codemirror.module';
import { IsFroalaModule } from '../../projects/is-froala/src/lib/is-froala.module';
import { AppComponent } from './app.component';
import { DemoSelectComponent } from './demo-select/demo-select.component';
import { DemoCodemirrorComponent } from './demo-codemirror/demo-codemirror.component';
import { DemoFroalaComponent } from './demo-froala/demo-froala.component';

export const routes: Routes = [
  { path: 'select', component: DemoSelectComponent },
  { path: 'codemirror', component: DemoCodemirrorComponent },
  { path: 'froala', component: DemoFroalaComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DemoSelectComponent,
    DemoCodemirrorComponent,
    DemoFroalaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule, FormsModule,
    IsSelectModule, IsCodemirrorModule,IsFroalaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
