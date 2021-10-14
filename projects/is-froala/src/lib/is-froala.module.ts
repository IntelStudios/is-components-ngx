import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IsCdkModule } from '@intelstudios/cdk';

import { IsFroalaComponent, configToken } from './is-froala.component';
import { IsFroalaConfig } from './is-froala.interfaces';

@NgModule({
  imports: [
    CommonModule,
    IsCdkModule,
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
