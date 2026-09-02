import { InjectionToken } from '@angular/core';
import type { IsFieldErrorTranslateFn } from '@intelstudios/cdk';

interface FieldErrorConfig {
  /**
   * prefix to apply when looking up error messages
   */
  translationPrefix: string;
  /**
   * Optional translator. Default returns the key unchanged (message fallback is used).
   */
  translateFn?: IsFieldErrorTranslateFn;
}

export interface IsCoreUIConfig {
  fieldErrorConfig?: FieldErrorConfig
}

export const configToken = new InjectionToken<IsCoreUIConfig>('IsCoreUIConfig');
