import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IsFieldError } from './is-field-error.model';

export class IsFieldErrorFactory {

  static requiredError() {
    const error = new IsFieldError('required', false).withPriority(1000);
    error.message = 'Field is required';

    return { required: error };
  }

  static inputMaskMatchError(mask: string) {
    const error = new IsFieldError('maskDoesNotMatch', false).withPriority(0);
    error.params = { mask: mask };
    error.message = 'Value does not match required mask';

    return { maskDoesNotMatch: error };
  }

  static minLengthError(minLength: number, actualLength: number) {
    const error: IsFieldError = new IsFieldError('minLength', false).withPriority(10);
    error.params = { requiredLength: minLength, actualLength: actualLength };
    error.message = `Minimum allowed characters is ${minLength}`;

    return { minLength: error };
  }

  static maxLengthError(maxLength: number, actualLength: number) {
    const error: IsFieldError = new IsFieldError('maxLength', false).withPriority(10);
    error.params = { requiredLength: maxLength, actualLength: actualLength };
    error.message = `Maximum allowed characters is ${maxLength}`;

    return { maxLength: error };
  }

  static minLengthPasswordError(passwordMinLength: number) {
    const error: IsFieldError = new IsFieldError('passwordMinLength', false).withPriority(10);
    error.params = { requiredLength: passwordMinLength };
    error.message = `Password must contain at least ${passwordMinLength} characters`;

    return { passwordMinLength: error };
  }

  static licenseKeyError() {
    const error: IsFieldError = new IsFieldError('licenseKey', false).withPriority(10);
    error.message = 'License key must match format XXX-XXXX-XXX';

    return { licenseKeyError: error };
  }

  static notANumberError() {
    const error: IsFieldError = new IsFieldError('notANumber', false).withPriority(10);
    error.message = 'Value is not a number';

    return { notANumber: error };
  }

  static emailError() {
    const error: IsFieldError = new IsFieldError('emailInvalid', false).withPriority(10);
    error.message = 'Value is not a valid email';

    return { emailInvalid: error };
  }

  static patternError(pattern: string, actual: string) {
    const error: IsFieldError = new IsFieldError('patternInvalid', false).withPriority(10);
    error.params = { requiredPattern: pattern, actual: actual };
    error.message = `Required pattern is ${pattern}`;

    return { patternInvalid: error };
  }

  static maxNumberError(maxNum: number, actual: number) {
    const error: IsFieldError = new IsFieldError('maxNumber', false).withPriority(20);
    error.params = { requiredMax: maxNum, actual: actual };
    error.message = `Maximum allowed number is ${maxNum}`;

    return { maxNumber: error };
  }

  static minNumberError(minNum: number, actual: number) {
    const error: IsFieldError = new IsFieldError('minNumber', false).withPriority(20);
    error.params = { requiredMin: minNum, actual: actual };
    error.message = `Minimum allowed number is ${minNum}`;

    return { minNumber: error };
  }

  static minMaxNumberError(minNum: number, maxNum: number, actual: number) {
    const error: IsFieldError = new IsFieldError('minMaxNumber', false).withPriority(20);
    error.params = { requiredMin: minNum, requiredMax: maxNum, actual: actual };
    error.message = `Number value must be between ${minNum} and ${maxNum}`;

    return { minMaxNumber: error };
  }

  static minDateError(minDate: string, actual: string) {
    const error: IsFieldError = new IsFieldError('minDate', false).withPriority(20);
    error.params = { requiredMin: minDate, actual };

    return { minDate: error };
  }

  static maxFileSizeError(maxSize: string) {
    const error: IsFieldError = new IsFieldError('maxFileSize', false).withPriority(20);
    error.params = { maxSize: maxSize };
    error.message = `Maximum file size is ${maxSize}`;

    return { maxFileSize: error };
  }

  static unsupportedFileType(supportedTypes: string) {
    const error: IsFieldError = new IsFieldError('unsupportedFileType', false).withPriority(20);
    error.params = { supportedTypes: supportedTypes };
    error.message = 'Unsupported file type';

    return { unsupportedFileType: error };
  }

  static recordWithSameValueAlreadyExistsError() {
    const error: IsFieldError = new IsFieldError('recordWithSameValueAlreadyExists', false).withPriority(30);
    error.message = 'Record with same value already exists';

    return { recordWithSameValueAlreadyExists: error };
  }

  static duplicityError() {
    const error: IsFieldError = new IsFieldError('duplicity', false).withPriority(30);
    error.message = 'Duplicity';

    return { recordWithSameValueAlreadyExists: error };
  }

  static passwordWeakError(minLength: number, actualLength: number) {
    const error = new IsFieldError('passwordWeak', false).withPriority(40);
    error.params = { minLength: minLength, actualLength: actualLength };
    error.message = 'Password is weak';

    return { passwordWeak: error };
  }

  static forbiddenChars(contains: string[]) {
    const error = new IsFieldError('forbiddenChars', false).withPriority(40);
    error.params = { contains: `[${contains.join(', ')}]` };
    error.message = 'Value contains invalid character(s)';

    return { forbiddenChars: error };
  }

  static passwordDoNotMatchError() {
    const error = new IsFieldError('passwordDoNotMatch', false).withPriority(50);
    error.message = 'Password does not match';

    return { passwordDoNotMatch: error };
  }

  static dateInvalidError() {
    const error = new IsFieldError('dateInvalid', false).withPriority(50);
    error.message = 'Date value is invalid';

    return { dateInvalid: error };
  }

  static timeInvalidError() {
    const error = new IsFieldError('timeInvalid', false).withPriority(50);
    error.message = 'Time value is invalid';

    return { timeInvalid: error };
  }

  static invalidCronError() {
    const error = new IsFieldError('invalidCron', false).withPriority(40);
    error.message = 'Invalid CRON expression';

    return { invalidCron: error };
  }

  static adminEndpointNameError() {
    const error = new IsFieldError('adminEndpointName', false).withPriority(40);
    error.message = 'Endpoint name must contain only number or letter characters';

    return { adminEndpointName: error };
  }

  static loginAlreadyUsedError() {
    const error = new IsFieldError('loginAlreadyUsed', false).withPriority(40);
    error.message = 'Login is already used';

    return { loginAlreadyUsed: error };
  }

  static prefillOrTemplateRequiredError() {
    const error = new IsFieldError('prefillOrTemplateRequired', false).withPriority(50);
    error.message = 'Either Prefill or Template must be selected';

    return { prefillOrTemplateRequired: error };
  }

  static inputMappingInvalid(missing: string[]) {
    const error = new IsFieldError('inputMapping', false).withPriority(50);
    error.message = 'Input mapping is invalid';
    error.params = { missing: `[${missing.join(', ')}]` };
    return { inputMapping: error };
  }

  static unspecifiedError(err: any) {
    const error = new IsFieldError('unspecified', false).withPriority(50);
    error.message = `Unspecified error (${JSON.stringify(err)})`;

    return { unspecified: error };
  }

  static codeViewIsActiveWarning() {
    const error = new IsFieldError('codeViewIsActive', false).withPriority(50);
    error.message = 'Please switch editor to WYSIWYG mode before saving';

    return { codeViewIsActive: error };
  }

  static getErrors(control: FormControl, prefix: string, translate: TranslateService, onlyHighest: boolean = true): string[] {
    let ret: string[] = [];
    if (control.errors !== null) {
      let remapped = {};
      // replace base angular validator errors to is-field-errors
      Object.keys(control.errors).forEach((key) => {
        if (control.errors[key] instanceof IsFieldError) {
          remapped = { ...{ key: control.errors[key] } };
        } else if (this.isSchemaFormError(control.errors[key])) {
          remapped = { ...this.replaceSchemaFormValidationError(key, control.errors[key]) };
        }
        else {
          remapped = { ...this.replaceAngularValidatorError(key, control.errors[key]) };
        }
      });

      if (onlyHighest) {
        let highestPriorityError: IsFieldError = null;
        Object.keys(remapped).forEach((key) => {
          if (highestPriorityError === null || highestPriorityError.priority <= remapped[key].priority) {
            highestPriorityError = remapped[key];
          }
        });

        const key = prefix + highestPriorityError.key;
        const translated: string = translate.instant(key, highestPriorityError.params);

        if (translated !== key) {
          ret.push(translated);
        } else {
          ret.push(highestPriorityError.message || '');
        }
      }
      else {
        Object.keys(remapped).forEach((key) => {
          let actError: IsFieldError = remapped[key];

          const prefixedKey = prefix + actError.key;
          const translated: string = translate.instant(prefixedKey, actError.params);

          if (translated !== prefixedKey) {
            ret.push(translated);
          } else {
            ret.push(actError.message || '');
          }
        })
      }
    }

    return ret;
  }

  private static isSchemaFormError(error: any) {
    return !!error.code;
  }

  private static replaceSchemaFormValidationError(key: string, error: any) {
    // TODO other errors can be mapped https://github.com/zaggino/z-schema/blob/v4.2.2/src/Errors.js
    switch (error.code) {
      case 'OBJECT_MISSING_REQUIRED_PROPERTY':
        return IsFieldErrorFactory.requiredError();
      case 'ONE_OF_MISSING':
        return IsFieldErrorFactory.requiredError();
      case 'MIN_LENGTH':
        return IsFieldErrorFactory.minLengthError(error.params[1], error.params[0]);
      case 'MAX_LENGTH':
        return IsFieldErrorFactory.maxLengthError(error.params[1], error.params[0]);
      case 'PATTERN':
        return IsFieldErrorFactory.patternError(error.params[1], error.params[0]);
      default:
        return IsFieldErrorFactory.unspecifiedError({ key: key, error: error });
    }
  }

  private static replaceAngularValidatorError(key: string, error: any) {
    switch (key) {
      case 'min':
        return IsFieldErrorFactory.minNumberError(error.min, error.actual);
      case 'max':
        return IsFieldErrorFactory.maxNumberError(error.max, error.actual);
      case 'required':
        return IsFieldErrorFactory.requiredError();
      case 'email':
        return IsFieldErrorFactory.emailError();
      case 'minlength':
        return IsFieldErrorFactory.minLengthError(error.requiredLength, error.actualLength);
      case 'maxlength':
        return IsFieldErrorFactory.maxLengthError(error.requiredLength, error.actualLength);
      case 'pattern':
        return IsFieldErrorFactory.patternError(error.requiredPattern, error.actualValue);
      default:
        return IsFieldErrorFactory.unspecifiedError({ key: key, error: error });
    }
  }
}
