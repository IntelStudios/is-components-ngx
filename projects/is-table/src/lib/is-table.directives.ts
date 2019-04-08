import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[is-table-column]'})
export class IsTableColumnDirective {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[is-table-actions-column]'})
export class IsTableActionsColumnDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
