import { IsFieldError } from './is-field-error.model';

export class IsFieldErrorFactory {

  static requiredError() {
    const error = new IsFieldError('required', false).withPriority(0);
    error.message = 'Field is required';

    return { required: error };
  }

  static inputMaskMatchError(mask: string) {
    const error = new IsFieldError('maskDoesNotMatch', false).withPriority(0);
    error.message = 'Value does not match required mask';
    error.params = { mask: mask };
    return { maskDoesNotMatch: error };
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

  static maxNumberError(maxNum: number, actual: number) {
    const error: IsFieldError = new IsFieldError('maxNumber', false).withPriority(20);
    error.params = { requiredMax: maxNum, actual: actual };

    return { maxNumber: error };
  }

  static maxFileSizeError(maxSize: string) {
    const error: IsFieldError = new IsFieldError('maxFileSize', false).withPriority(20);
    error.params = { maxSize: maxSize };

    return { maxFileSize: error };
  }

  static unsupportedFileType(supportedTypes: string) {
    const error: IsFieldError = new IsFieldError('unsupportedFileType', false).withPriority(20);
    error.params = { supportedTypes: supportedTypes };

    return { unsupportedFileType: error };
  }

  static minNumberError(minNum: number, actual: number) {
    const error: IsFieldError = new IsFieldError('minNumber', false).withPriority(20);
    error.params = { requiredMin: minNum, actual: actual };

    return { minNumber: error };
  }

  static minMaxNumberError(minNum: number, maxNum: number, actual: number) {
    const error: IsFieldError = new IsFieldError('minMaxNumber', false).withPriority(20);
    error.params = { requiredMin: minNum, requiredMax: maxNum, actual: actual };

    return { minMaxNumber: error };
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

  static codeViewIsActiveWarning() {
    const error = new IsFieldError('codeViewIsActive', false).withPriority(50);
    error.message = 'Please switch editor to WYSIWYG mode before saving';

    return { codeViewIsActive: error };
  }
}
