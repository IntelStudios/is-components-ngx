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

  static invalidTypeSFError(expected: string, actual: string) {
    const error: IsFieldError = new IsFieldError('schemaFormInvalidType', false).withPriority(60);
    error.params = { expected, actual };
    error.message = `Expected type ${expected} but found type ${actual}`;

    return { schemaFormInvalidType: error };
  }

  static invalidFormatSFError(format1: string, format2: string) {
    const error: IsFieldError = new IsFieldError('schemaFormInvalidFormat', false).withPriority(60);
    error.params = { format1, format2 };
    error.message = `Object didn't pass validation for format ${format1}: ${format2}`;

    return { schemaFormInvalidFormat: error };
  }

  static enumMismatchSFError(value: string) {
    const error: IsFieldError = new IsFieldError('schemaFormEnumMismatch', false).withPriority(60);
    error.params = { value };
    error.message = `No enum match for: ${value}`;

    return { schemaFormEnumMismatch: error };
  }

  static oneOfMultipleSFError() {
    const error: IsFieldError = new IsFieldError('schemaFormOneOfMultiple', false).withPriority(60);
    error.message = 'Data is valid against more than one schema from \'oneOf\'';

    return { schemaFormOneOfMultiple: error };
  }

  static notPassedSFError() {
    const error: IsFieldError = new IsFieldError('schemaFormNotPassed', false).withPriority(60);
    error.message = 'Data matches schema from \'not\'';

    return { schemaFormNotPassed: error };
  }

  static arrayLengthShortSFError(minLength: number, actualLength: number) {
    const error: IsFieldError = new IsFieldError('schemaFormArrayLengthShort', false).withPriority(60);
    error.params = { minLength: minLength, actualLength: actualLength };
    error.message = `Array is too short (${actualLength}), minimum ${minLength}`;

    return { schemaFormArrayLengthShort: error };
  }

  static arrayLengthLongSFError(maxLength: number, actualLength: number) {
    const error: IsFieldError = new IsFieldError('schemaFormArrayLengthLong', false).withPriority(60);
    error.params = { maxLength: maxLength, actualLength: actualLength };
    error.message = `Array is too long (${actualLength}), maximum ${maxLength}`;

    return { schemaFormArrayLengthLong: error };
  }

  static arrayUniqueSFError(index1: number, index2: number) {
    const error: IsFieldError = new IsFieldError('schemaFormArrayUnique', false).withPriority(60);
    error.params = { index1: index1, index2: index2 };
    error.message = `Array items are not unique (indexes ${index1} and ${index2})`;

    return { schemaFormArrayUnique: error };
  }

  static arrayAdditionalItemsSFError() {
    const error: IsFieldError = new IsFieldError('schemaFormArrayAdditionalItems', false).withPriority(60);
    error.message = 'Additional items not allowed';

    return { schemaFormArrayAdditionalItems: error };
  }

  static numberMultipleOfSFError(actual: number, multiple: number) {
    const error: IsFieldError = new IsFieldError('schemaFormNumberMultipleOf', false).withPriority(60);
    error.params = { multiple: multiple, actual: actual };
    error.message = `Value ${actual} is not a multiple of ${multiple}`;

    return { schemaFormArrayAdditionalItems: error };
  }

  static objPropsMinSFError(actual: number, min: number) {
    const error: IsFieldError = new IsFieldError('schemaFormObjPropsMin', false).withPriority(60);
    error.params = { minimum: min, actual: actual };
    error.message = `Too few properties defined (${actual}), minimum ${min}`;

    return { schemaFormObjPropsMin: error };
  }

  static objPropsMaxSFError(actual: number, max: number) {
    const error: IsFieldError = new IsFieldError('schemaFormObjPropsMax', false).withPriority(60);
    error.params = { maximum: max, actual: actual };
    error.message = `Too many properties defined (${actual}), maximum ${max}`;

    return { schemaFormObjPropsMax: error };
  }

  static objAdditionalPropsSFError(prop: string) {
    const error: IsFieldError = new IsFieldError('schemaFormObjAdditionalProps', false).withPriority(60);
    error.params = { property: prop };
    error.message = `Additional properties not allowed: ${prop}`;

    return { schemaFormObjAdditionalProps: error };
  }

  static objDepKeySFError(key1: string, key2: string) {
    const error: IsFieldError = new IsFieldError('schemaFormObjDepKey', false).withPriority(60);
    error.params = { key1: key1, key2: key2 };
    error.message = `Dependency failed - key must exist: ${key1} (due to key: ${key2})`;

    return { schemaFormObjDepKey: error };
  }

  static keyTypeExpectedSFError(key: string, type: string) {
    const error: IsFieldError = new IsFieldError('schemaFormKeyTypeExpected', false).withPriority(60);
    error.params = { key: key, type: type };
    error.message = `Keyword '${key}' is expected to be of type '${type}`;

    return { schemaFormKeyTypeExpected: error };
  }

  static keyUndefinedSFError(key: string) {
    const error: IsFieldError = new IsFieldError('schemaFormKeyUndefined', false).withPriority(60);
    error.params = { key: key };
    error.message = `Keyword '${key}' must be defined in strict mode`;

    return { schemaFormKeyUndefined: error };
  }

  static keyUnexpectedSFError(key: string) {
    const error: IsFieldError = new IsFieldError('schemaFormKeyUnexpected', false).withPriority(60);
    error.params = { key: key };
    error.message = `Keyword '${key}' is not expected to appear in the schema`;

    return { schemaFormKeyUnexpected: error };
  }

  static keyMustBeSFError(key: string, type: string) {
    const error: IsFieldError = new IsFieldError('schemaFormKeyMustBe', false).withPriority(60);
    error.params = { key: key, type: type };
    error.message = `Keyword '${key}' must be ${type}`;

    return { schemaFormKeyMustBe: error };
  }

  static keyDepSFError(key: string, requires: string) {
    const error: IsFieldError = new IsFieldError('schemaFormKeyDep', false).withPriority(60);
    error.params = { key: key, requires: requires };
    error.message = `Keyword '${key}' requires keyword '${requires}'`;

    return { schemaFormKeyMustBe: error };
  }

  static keyValTypeSFError(key: string, type: string) {
    const error: IsFieldError = new IsFieldError('schemaFormKeyValType', false).withPriority(60);
    error.params = { key: key, type: type };
    error.message = `Each element of keyword '${key}' array must be a '${type}'`;

    return { schemaFormKeyValType: error };
  }

  static unknownFormatSFError(format: string) {
    const error: IsFieldError = new IsFieldError('schemaFormUnknownFormat', false).withPriority(60);
    error.params = { format: format };
    error.message = `There is no validation function for format '${format}'`;

    return { schemaFormUnknownFormat: error };
  }

  static custModeForceSFError(prop: string) {
    const error: IsFieldError = new IsFieldError('schemaFormCustModeForce', false).withPriority(60);
    error.params = { prop: prop };
    error.message = `${prop} must define at least one property if present`;

    return { schemaFormCustModeForce: error };
  }

  static refUnresolvedSFError(ref: string) {
    const error: IsFieldError = new IsFieldError('schemaFormRefUnresolved', false).withPriority(60);
    error.params = { ref: ref };
    error.message = `Reference has not been resolved during compilation: ${ref}`;

    return { schemaFormRefUnresolved: error };
  }

  static refUnresolvableSFError(ref: string) {
    const error: IsFieldError = new IsFieldError('schemaFormRefUnresolvable', false).withPriority(60);
    error.params = { ref: ref };
    error.message = `Reference could not be resolved: ${ref}`;

    return { schemaFormRefUnresolvable: error };
  }

  static schemaNotReachSFError(uri: string) {
    const error: IsFieldError = new IsFieldError('schemaFormSchemaNotReach', false).withPriority(60);
    error.params = { uri: uri };
    error.message = `Validator was not able to read schema with uri: ${uri}`;

    return { schemaFormSchemaNotReach: error };
  }

  static schemaTypeExpectSFError() {
    const error: IsFieldError = new IsFieldError('schemaFormSchemaTypeExpect', false).withPriority(60);
    error.message = 'Schema is expected to be of type \'object\'';

    return { schemaFormSchemaTypeExpect: error };
  }

  static schemaNotAnObjSFError(type: string) {
    const error: IsFieldError = new IsFieldError('schemaFormSchemaNotAnObj', false).withPriority(60);
    error.params = { type: type };
    error.message = `Schema is not an object: ${type}`;

    return { schemaFormSchemaNotAnObj: error };
  }

  static asyncTimeoutSFError(count: number, timeout: number) {
    const error: IsFieldError = new IsFieldError('schemaFormAsyncTimeout', false).withPriority(60);
    error.params = { count: count, timeout: timeout };
    error.message = `${count} asynchronous task(s) have timed out after ${timeout} ms`;

    return { schemaFormAsyncTimeout: error };
  }

  static parentSchemaValFailedSFError() {
    const error: IsFieldError = new IsFieldError('schemaFormParentSchemaValFailed', false).withPriority(60);
    error.message = 'Schema failed to validate against its parent schema, see inner errors for details';

    return { schemaFormParentSchemaValFailed: error };
  }

  static remoteNotValidSFError(ref: string) {
    const error: IsFieldError = new IsFieldError('schemaFormRemoteNotValid', false).withPriority(60);
    error.params = { ref: ref };
    error.message = `Remote reference didn't compile successfully: ${ref}`;

    return { schemaFormRemoteNotValid: error };
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
      case 'INVALID_TYPE':
        return IsFieldErrorFactory.invalidTypeSFError(error.params[0], error.params[1]);
      case 'INVALID_FORMAT':
        return IsFieldErrorFactory.invalidFormatSFError(error.params[0], error.params[1]);
      case 'ENUM_MISMATCH':
      case 'ENUM_CASE_MISMATCH':
        return IsFieldErrorFactory.enumMismatchSFError(error.params[0]);
      case 'ANY_OF_MISSING':
      case 'ONE_OF_MISSING':
        return IsFieldErrorFactory.requiredError();
      case 'ONE_OF_MULTIPLE':
        return IsFieldErrorFactory.oneOfMultipleSFError();
      case 'NOT_PASSED':
        return IsFieldErrorFactory.notPassedSFError();

      // array errors
      case 'ARRAY_LENGTH_SHORT':
        return IsFieldErrorFactory.arrayLengthShortSFError(error.params[0], error.params[1]);
      case 'ARRAY_LENGTH_LONG':
        return IsFieldErrorFactory.arrayLengthLongSFError(error.params[0], error.params[1]);
      case 'ARRAY_UNIQUE':
        return IsFieldErrorFactory.arrayUniqueSFError(error.params[0], error.params[1]);
      case 'ARRAY_ADDITIONAL_ITEMS':
        return IsFieldErrorFactory.arrayAdditionalItemsSFError();

      // numeric errors
      case 'MULTIPLE_OF':
        return IsFieldErrorFactory.numberMultipleOfSFError(error.params[0], error.params[1]);
      case 'MINIMUM':
      case 'MINIMUM_EXCLUSIVE':
          return IsFieldErrorFactory.minNumberError(error.params[1], error.params[0]);
      case 'MAXIMUM':
      case 'MAXIMUM_EXCLUSIVE':
          return IsFieldErrorFactory.maxNumberError(error.params[1], error.params[0]);

      // object errors
      case 'OBJECT_PROPERTIES_MINIMUM':
        return IsFieldErrorFactory.objPropsMinSFError(error.params[0], error.params[1]);
      case 'OBJECT_PROPERTIES_MAXIMUM':
        return IsFieldErrorFactory.objPropsMaxSFError(error.params[0], error.params[1]);
      case 'OBJECT_MISSING_REQUIRED_PROPERTY':
        return IsFieldErrorFactory.requiredError();
      case 'OBJECT_ADDITIONAL_PROPERTIES':
        return IsFieldErrorFactory.objAdditionalPropsSFError(error.params[0]);
      case 'OBJECT_DEPENDENCY_KEY':
        return IsFieldErrorFactory.objDepKeySFError(error.params[0], error.params[1]);

      // string errors
      case 'MIN_LENGTH':
        return IsFieldErrorFactory.minLengthError(error.params[1], error.params[0]);
      case 'MAX_LENGTH':
        return IsFieldErrorFactory.maxLengthError(error.params[1], error.params[0]);
      case 'PATTERN':
        return IsFieldErrorFactory.patternError(error.params[1], error.params[0]);

      // schema validation errors
      case 'KEYWORD_TYPE_EXPECTED':
        return IsFieldErrorFactory.keyTypeExpectedSFError(error.params[0], error.params[1]);
      case 'KEYWORD_UNDEFINED_STRICT':
        return IsFieldErrorFactory.keyUndefinedSFError(error.params[0]);
      case 'KEYWORD_UNEXPECTED':
        return IsFieldErrorFactory.keyUnexpectedSFError(error.params[0]);
      case 'KEYWORD_MUST_BE':
        return IsFieldErrorFactory.keyMustBeSFError(error.params[0], error.params[1]);
      case 'KEYWORD_DEPENDENCY':
        return IsFieldErrorFactory.keyDepSFError(error.params[0], error.params[1]);
      case 'KEYWORD_PATTERN':
        return IsFieldErrorFactory.patternError(error.params[1], error.params[0]);
      case 'KEYWORD_VALUE_TYPE':
        return IsFieldErrorFactory.keyValTypeSFError(error.params[0], error.params[1]);
      case 'UNKNOWN_FORMAT':
        return IsFieldErrorFactory.unknownFormatSFError(error.params[0]);
      case 'CUSTOM_MODE_FORCE_PROPERTIES':
        return IsFieldErrorFactory.custModeForceSFError(error.params[0]);

      // remote errors
      case 'REF_UNRESOLVED':
        return IsFieldErrorFactory.refUnresolvedSFError(error.params[0]);
      case 'UNRESOLVABLE_REFERENCE':
        return IsFieldErrorFactory.refUnresolvableSFError(error.params[0]);
      case 'SCHEMA_NOT_REACHABLE':
        return IsFieldErrorFactory.schemaNotReachSFError(error.params[0]);
      case 'SCHEMA_TYPE_EXPECTED':
        return IsFieldErrorFactory.schemaTypeExpectSFError();
      case 'SCHEMA_NOT_AN_OBJECT':
        return IsFieldErrorFactory.schemaNotAnObjSFError(error.params[0]);
      case 'ASYNC_TIMEOUT':
        return IsFieldErrorFactory.asyncTimeoutSFError(error.params[0], error.params[1]);
      case 'PARENT_SCHEMA_VALIDATION_FAILED':
        return IsFieldErrorFactory.parentSchemaValFailedSFError();
      case 'REMOTE_NOT_VALID':
        return IsFieldErrorFactory.remoteNotValidSFError(error.params[0]);

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
