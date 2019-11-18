import { InjectionToken } from '@angular/core';

interface FieldErrorConfig {
  /**
   * prefix to apply to translate pipe/service when translating error messages
   */
  translationPrefix: string
}

export interface IsCoreUIConfig {
  fieldErrorConfig? :FieldErrorConfig
}

export const configToken = new InjectionToken<IsCoreUIConfig>('IsCoreUIConfig');
