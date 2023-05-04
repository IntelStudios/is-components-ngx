import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box/is-breadcrumb-box.component';
import { IsCheckboxComponent, IsRadioGroupDirective } from './is-checkbox/is-checkbox.component';
import { IsSwitchComponent } from './is-switch/is-switch.component';
import { configToken, IsCoreUIConfig } from './is-core-ui.interfaces';
import { IsFieldErrorComponent } from './is-field-error/is-field-error.component';
import { IsPasswordComponent } from './is-password/is-password.component';
import { IsPortletComponent } from './is-portlet/is-portlet.component';
import { IsPortletTitleDirective } from './is-portlet/is-portlet.directives';
import { IsSearchComponent } from './is-search/is-search.component';
import {
  IsTabContentDirective,
  IsTabsetInvalidDirective,
  IsTabDirective,
  IsTabsetComponent,
  IsTabTitleDirective,
  IsTabsetAfterNavItemsDirective,
} from './is-tabset/is-tabset.component';
import { IsTileComponent } from './is-tile/is-tile.component';
import { IsCdkModule } from '@intelstudios/cdk';
import { IsHintComponent } from './is-hint/is-hint.component';
import { IsInputSecretComponent } from './is-input-secret/is-input-secret.component';
import { IsInputMaskDirective } from './input-mask.directive';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule, PopoverModule, ScrollingModule, TooltipModule, IsCdkModule
  ],
  declarations: [
    IsBreadcrumbBoxComponent,
    IsPortletComponent,
    IsPortletTitleDirective,
    IsHintComponent,
    IsTabsetComponent,
    IsPasswordComponent,
    IsTabsetAfterNavItemsDirective,
    IsTabDirective,
    IsTabTitleDirective,
    IsTabsetInvalidDirective,
    IsTabContentDirective,
    IsFieldErrorComponent,
    IsSearchComponent,
    IsCheckboxComponent,
    IsRadioGroupDirective,
    IsSwitchComponent,
    IsTileComponent,
    IsInputSecretComponent,
    IsInputMaskDirective,
  ],
  exports: [
    IsBreadcrumbBoxComponent,
    IsPortletComponent,
    IsPortletTitleDirective,
    IsTabsetComponent,
    IsPasswordComponent,
    IsTabDirective,
    IsTabTitleDirective,
    IsTabsetInvalidDirective,
    IsTabContentDirective,
    IsTabsetAfterNavItemsDirective,
    IsHintComponent,
    IsFieldErrorComponent,
    IsSearchComponent,
    IsCheckboxComponent,
    IsRadioGroupDirective,
    IsSwitchComponent,
    IsTileComponent,
    IsInputSecretComponent,
    IsInputMaskDirective,
  ]
})
export class IsCoreUIModule {
  static forRoot(config?: IsCoreUIConfig): ModuleWithProviders<IsCoreUIModule> {
    return {
      ngModule: IsCoreUIModule,
      providers: [
        { provide: configToken, useValue: config }
      ]
    }
  }
}
