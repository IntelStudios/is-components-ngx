export class FieldErrorModel {
  key: string;
  priority: number;
  valid: boolean;
  params: any;
  message: string = null;

  constructor(key: string, valid: boolean) {
    this.key = key;
    this.valid = valid;
  }

  withMessage(message: string): FieldErrorModel {
    this.message = message;
    return this;
  }

  setPriority(priority: number): FieldErrorModel {
    this.priority = priority;

    return this;
  }
}
