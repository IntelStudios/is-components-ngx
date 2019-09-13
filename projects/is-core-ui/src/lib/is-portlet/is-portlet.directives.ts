import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[is-portlet-title]'})
export class IsPortletTitleDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
