import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[is-selectpicker-option]' })
export class IsSelectpickerOptionDirective {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({ selector: '[is-selectpicker-selection]' })
export class IsSelectpickerOptionSelectedDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
