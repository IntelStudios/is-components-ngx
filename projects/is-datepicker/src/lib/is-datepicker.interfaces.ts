import { InjectionToken } from '@angular/core';

export interface IsDatepickerConfig {
  /**
   * default display date format (angular date pipe)
   */
  viewFormat?: string;

  /**
   * mark for ngx-mask input
   */
  mask?: string;
}

export const configToken = new InjectionToken<IsDatepickerConfig>('IsDatepickerConfig');
