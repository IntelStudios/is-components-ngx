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
import { IsSectionComponent } from './is-section/is-section.component';
import { IsSectionTitleDirective } from './is-section/is-section.directives';
import {
  IsTabContentDirective,
  IsTabDirective,
  IsTabsetComponent,
  IsTabTitleDirective,
} from './is-tabset/is-tabset.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule, PopoverModule, TooltipModule
  ],
  declarations: [IsBreadcrumbBoxComponent, IsPortletComponent, IsPortletTitleDirective, IsSectionComponent, IsSectionTitleDirective, IsTabsetComponent,
    IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent],
  exports: [IsBreadcrumbBoxComponent, IsPortletComponent, IsPortletTitleDirective, IsSectionComponent, IsSectionTitleDirective, IsTabsetComponent,
    IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent]
})
export class IsMetronicModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsMetronicModule
    }
  }
}
