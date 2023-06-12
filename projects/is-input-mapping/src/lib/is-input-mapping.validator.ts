import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IsInputMappingComponent } from './components/input-mapping/is-input-mapping.component';
import { IsFieldErrorFactory } from '@intelstudios/cdk';

export function isInputRequiredFilledValidator(input: IsInputMappingComponent): ValidatorFn {
  return (_: AbstractControl): ValidationErrors | null => {
    const missing = input.getAllItems()
      .filter(item => !item.assigned && !item.item.AllowNull)
      .map(item => item.item.Name);
    if (missing.length > 0) {
      return IsFieldErrorFactory.inputMappingInvalid(missing);
    }
    return null;
  };
}
