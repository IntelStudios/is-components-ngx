import { FieldErrorModel } from './is-field-error.model';

export class FieldErrorService {

  static requiredError() {
    const error = new FieldErrorModel('required', false).setPriority(0);
    error.message = 'Field is required';

    return { required: error };
  }

  static maxLengthError(maxLength: number, actualLength: number) {
    const error: FieldErrorModel = new FieldErrorModel('maxLength', false).setPriority(10);
    error.params = { requiredLength: maxLength, actualLength: actualLength };
    error.message = 'Required max number of characters';

    return { maxLength: error };
  }

  static licenseKeyError() {
    const error: FieldErrorModel = new FieldErrorModel('licenseKey', false).setPriority(10);
    error.message = 'License key must match format XXX-XXXX-XXX';

    return { licenseKeyError: error };
  }

  static notANumberError() {
    const error: FieldErrorModel = new FieldErrorModel('notANumber', false).setPriority(10);
    error.message = 'Value is not a number';

    return { notANumber: error };
  }

  static maxNumberError(maxNum: number, actual: number) {
    const error: FieldErrorModel = new FieldErrorModel('maxNumber', false).setPriority(20);
    error.params = { requiredMax: maxNum, actual: actual };

    return { maxNumber: error };
  }

  static recordWithSameValueAlreadyExistsError() {
    const error: FieldErrorModel = new FieldErrorModel('recordWithSameValueAlreadyExists', false).setPriority(30);
    error.message = 'Record with same value already exists';

    return { recordWithSameValueAlreadyExists: error };
  }

  static passwordWeakError(minLength: number, actualLength: number) {
    const error = new FieldErrorModel('passwordWeak', false).setPriority(40);
    error.params = { minLength: minLength, actualLength: actualLength };
    error.message = 'Password is weak';

    return { passwordWeak: error };
  }

  static forbiddenChars(contains: string[]) {
    const error = new FieldErrorModel('forbiddenChars', false).setPriority(40);
    error.params = { contains: `[${contains.join(', ')}]` };
    error.message = 'Value contains invalid character(s)';

    return { forbiddenChars: error };
  }

  static passwordDoNotMatchError() {
    const error = new FieldErrorModel('passwordDoNotMatch', false).setPriority(50);
    error.message = 'Password does not match';

    return { passwordDoNotMatch: error };
  }

  static invalidCronError() {
    const error = new FieldErrorModel('invalidCron', false).setPriority(40);
    error.message = 'Invalid CRON expression';

    return { invalidCron: error };
  }

  static adminEndpointNameError() {
    const error = new FieldErrorModel('adminEndpointName', false).setPriority(40);
    error.message = 'Endpoint name must contain only number or letter characters';

    return { adminEndpointName: error };
  }

  static loginAlreadyUsedError() {
    const error = new FieldErrorModel('loginAlreadyUsed', false).setPriority(40);
    error.message = 'Login is already used';

    return { loginAlreadyUsed: error };
  }

  static prefillOrTemplateRequiredError() {
    const error = new FieldErrorModel('prefillOrTemplateRequired', false).setPriority(50);
    error.message = 'Either Prefill or Template must be selected';

    return { prefillOrTemplateRequired: error };
  }

  static codeViewIsActiveWarning() {
    const error = new FieldErrorModel('codeViewIsActive', false).setPriority(50);
    error.message = 'Please switch editor to WYSIWYG mode before saving';

    return { codeViewIsActive: error };
  }
}
