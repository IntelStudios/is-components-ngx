import { InjectionToken } from '@angular/core';

export interface IsDatepickerConfig {
  /**
  * default display date format (angular date pipe)
  */
  viewFormat?: string;
}

export const configToken = new InjectionToken<IsDatepickerConfig>('IsDatepickerConfig');
