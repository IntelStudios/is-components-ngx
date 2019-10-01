import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box/is-breadcrumb-box.component';
import { IsFieldErrorComponent } from './is-field-error/is-field-error.component';
import { IsHintComponent } from './is-hint/is-hint.component';
import { IsPortletComponent } from './is-portlet/is-portlet.component';
import { IsPortletTitleDirective } from './is-portlet/is-portlet.directives';
import {
  IsTabContentDirective,
  IsTabDirective,
  IsTabsetComponent,
  IsTabTitleDirective,
} from './is-tabset/is-tabset.component';
import { IsSearchComponent } from './is-search/is-search.component';
import { IsPasswordComponent } from './is-password/is-password.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule, PopoverModule, TooltipModule
  ],
  declarations: [IsBreadcrumbBoxComponent, IsPortletComponent, IsPortletTitleDirective, IsTabsetComponent, IsPasswordComponent,
    IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent, IsSearchComponent],
  exports: [IsBreadcrumbBoxComponent, IsPortletComponent, IsPortletTitleDirective, IsTabsetComponent, IsPasswordComponent,
    IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent, IsSearchComponent]
})
export class IsCoreUIModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsCoreUIModule
    }
  }
}
