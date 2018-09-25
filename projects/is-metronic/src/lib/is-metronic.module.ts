import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box/is-breadcrumb-box.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IsPortletComponent } from './is-portlet/is-portlet.component';
import { IsSectionComponent } from './is-section/is-section.component';
import { IsTabsetComponent, IsTabDirective, IsTabTitleDirective, IsTabContentDirective } from './is-tabset/is-tabset.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, TranslateModule
  ],
  declarations: [IsBreadcrumbBoxComponent, IsPortletComponent, IsSectionComponent, IsTabsetComponent,
  IsTabDirective, IsTabTitleDirective, IsTabContentDirective],
  exports: [IsBreadcrumbBoxComponent, IsPortletComponent, IsSectionComponent, IsTabsetComponent,
  IsTabDirective, IsTabTitleDirective, IsTabContentDirective]
})
export class IsMetronicModule { }
