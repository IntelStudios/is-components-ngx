import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IsBootstrapSwitchConfig } from './is-bootstrap-switch.interfaces';
import { IsBootstrapSwitchComponent, configToken } from './is-bootstrap-switch.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, TranslateModule
  ],
  declarations: [IsBootstrapSwitchComponent],
  exports: [IsBootstrapSwitchComponent]
})
export class IsBootstrapSwitchModule {
  static forRoot(config: IsBootstrapSwitchConfig): ModuleWithProviders {
    return {
      ngModule: IsBootstrapSwitchModule,
      providers: [
        { provide: configToken, useValue: config }
      ]
    }
  }
}
