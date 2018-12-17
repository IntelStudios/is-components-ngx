import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box/is-breadcrumb-box.component';
import { IsFieldErrorComponent } from './is-field-error/is-field-error.component';
import { IsHintComponent } from './is-hint/is-hint.component';
import { IsPortletComponent } from './is-portlet/is-portlet.component';
import { IsSectionComponent } from './is-section/is-section.component';
import {
  IsTabContentDirective,
  IsTabDirective,
  IsTabsetComponent,
  IsTabTitleDirective,
} from './is-tabset/is-tabset.component';
import { TooltipModule, TooltipConfig } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule, PopoverModule, TooltipModule
  ],
  declarations: [IsBreadcrumbBoxComponent, IsPortletComponent, IsSectionComponent, IsTabsetComponent,
  IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent],
  exports: [IsBreadcrumbBoxComponent, IsPortletComponent, IsSectionComponent, IsTabsetComponent,
  IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent, IsFieldErrorComponent]
})
export class IsMetronicModule {
  static forRoot(config: PopoverConfig, tooltipConfig: TooltipConfig): ModuleWithProviders {
    return {
      ngModule: IsMetronicModule,
      providers: [
        { provide: PopoverConfig, useValue: config },
        { provide: TooltipConfig, useValue: tooltipConfig }
      ]
    }
  }
 }
