import '@vitest/expect';

declare module '@vitest/expect' {
  interface Assertion<T = unknown> {
    toBeTrue(): void;
    toBeFalse(): void;
    withContext(message: string): Assertion<T>;
  }
}

export {};
