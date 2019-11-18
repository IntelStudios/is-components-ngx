export class IsFieldError {
  key: string;
  priority: number;
  valid: boolean;
  params: any;
  message: string = null;

  constructor(key: string, valid: boolean) {
    this.key = key;
    this.valid = valid;
  }

  withMessage(message: string): IsFieldError {
    this.message = message;
    return this;
  }

  withPriority(priority: number): IsFieldError {
    this.priority = priority;
    return this;
  }
}
