import './test-setup-jquery';
import { expect } from 'vitest';

expect.extend({
  toBeTrue(received: unknown) {
    return {
      pass: received === true,
      message: () => `expected ${received} to be true`,
    };
  },
  toBeFalse(received: unknown) {
    return {
      pass: received === false,
      message: () => `expected ${received} to be false`,
    };
  },
});

const assertionProto = Object.getPrototypeOf(expect(true));
Object.defineProperty(assertionProto, 'withContext', {
  configurable: true,
  value: function withContext(_message?: string) {
    return this;
  },
});
