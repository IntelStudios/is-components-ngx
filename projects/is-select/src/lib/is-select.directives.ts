import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[is-select-option]'})
export class IsSelectOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
