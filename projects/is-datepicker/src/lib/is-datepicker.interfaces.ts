import { InjectionToken } from '@angular/core';

export interface IsDatepickerConfig {
  /**
  * default display date format (angular date pipe)
  */
  viewFormat?: string;
  /**
   * when localDateMode enabled, picker will understand date as local, without time
   */
  localDateMode?: boolean;
}

export const configToken = new InjectionToken<IsDatepickerConfig>('IsDatepickerConfig');
