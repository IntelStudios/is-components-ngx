import { AbstractControl, ValidationErrors } from '@angular/forms';
import { IsFieldErrorFactory } from 'projects/is-cdk/src/public-api';

export function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export class IsValidators {

  static required(control: AbstractControl): ValidationErrors|null {
    return isEmptyInputValue(control.value) ? IsFieldErrorFactory.requiredError() : null;
  }



}
