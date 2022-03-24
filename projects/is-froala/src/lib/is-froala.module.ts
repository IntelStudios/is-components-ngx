import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IsFroalaComponent, configToken } from './is-froala.component';
import { IsFroalaConfig } from './is-froala.interfaces';
import { IsFroalaService } from './is-froala.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [IsFroalaComponent],
  exports: [IsFroalaComponent]
})
export class IsFroalaModule {

  static forRoot(config: IsFroalaConfig): ModuleWithProviders {
    return {
      ngModule: IsFroalaModule,
      providers: [
        { provide: configToken, useValue: config },
        IsFroalaService,
      ]
    }
  }
}
