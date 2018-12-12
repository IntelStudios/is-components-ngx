import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box/is-breadcrumb-box.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { IsPortletComponent } from './is-portlet/is-portlet.component';
import { IsSectionComponent } from './is-section/is-section.component';
import { IsTabsetComponent, IsTabDirective, IsTabTitleDirective, IsTabContentDirective } from './is-tabset/is-tabset.component';
import { IsHintComponent } from './is-hint/is-hint.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule, PopoverModule
  ],
  declarations: [IsBreadcrumbBoxComponent, IsPortletComponent, IsSectionComponent, IsTabsetComponent,
  IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent],
  exports: [IsBreadcrumbBoxComponent, IsPortletComponent, IsSectionComponent, IsTabsetComponent,
  IsTabDirective, IsTabTitleDirective, IsTabContentDirective, IsHintComponent]
})
export class IsMetronicModule {
  static forRoot(config: PopoverConfig): ModuleWithProviders {
    return {
      ngModule: IsMetronicModule,
      providers: [
        { provide: PopoverConfig, useValue: config }
      ]
    }
  }
 }
