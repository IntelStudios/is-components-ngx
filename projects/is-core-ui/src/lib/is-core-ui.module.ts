import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box/is-breadcrumb-box.component';
import { IsCheckboxComponent, IsRadioGroupDirective } from './is-checkbox/is-checkbox.component';
import { configToken, IsCoreUIConfig } from './is-core-ui.interfaces';
import { IsFieldErrorComponent } from './is-field-error/is-field-error.component';
import { IsHintComponent } from './is-hint/is-hint.component';
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
} from './is-tabset/is-tabset.component';
import { IsTileComponent } from './is-tile/is-tile.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule, PopoverModule, TooltipModule
  ],
  declarations: [IsBreadcrumbBoxComponent, IsPortletComponent, IsPortletTitleDirective, IsTabsetComponent, IsPasswordComponent,
    IsTabDirective, IsTabTitleDirective, IsTabsetInvalidDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent, IsSearchComponent, IsCheckboxComponent, IsRadioGroupDirective, IsTileComponent],
  exports: [IsBreadcrumbBoxComponent, IsPortletComponent, IsPortletTitleDirective, IsTabsetComponent, IsPasswordComponent,
    IsTabDirective, IsTabTitleDirective, IsTabsetInvalidDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent, IsSearchComponent, IsCheckboxComponent, IsRadioGroupDirective, IsTileComponent]
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
