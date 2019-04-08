import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[is-data-table-column]'})
export class IsDataTableColumnDirective {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[is-data-table-actions-column]'})
export class IsDataTableActionsColumnDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
