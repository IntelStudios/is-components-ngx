import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IsInputMappingComponent } from './is-input-mapping.component';

export function isInputRequiredFilledValidator(input: IsInputMappingComponent): ValidatorFn {
  return (_: AbstractControl): ValidationErrors | null => {
    for (const item of input.getAllItems()) {
      if (!item.assigned && !item.item.AllowNull) {
        return {'is-input-mapping-unfilled': `${item.item.Name} is required, yet unfilled`};
      }
    }
    return null;
  };
}
