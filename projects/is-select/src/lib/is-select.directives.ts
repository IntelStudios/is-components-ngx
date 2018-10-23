import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[is-select-option]'})
export class IsSelectOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({selector: '[is-select-selection]'})
export class IsSelectOptionSelectedDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
