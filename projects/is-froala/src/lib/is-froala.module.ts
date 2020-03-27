import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { IsFroalaComponent, configToken } from './is-froala.component';
import { IsFroalaConfig } from './is-froala.interfaces';

@NgModule({
  imports: [
  ],
  declarations: [IsFroalaComponent],
  exports: [IsFroalaComponent]
})
export class IsFroalaModule {

  static forRoot(config: IsFroalaConfig): ModuleWithProviders<IsFroalaModule> {
    return {
      ngModule: IsFroalaModule,
      providers: [
        { provide: configToken, useValue: config }
      ]
    }
  }
}
