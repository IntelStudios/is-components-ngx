import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[is-section-title]'})
export class IsSectionTitleDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
