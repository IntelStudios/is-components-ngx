import { DatePipe } from '@angular/common';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideIsCdk } from '@intelstudios/cdk';
import { provideIsTimepicker } from '@intelstudios/timepicker';

import { configToken, IsDatepickerConfig } from './is-datepicker.interfaces';

export function provideIsDatepicker(config?: IsDatepickerConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: configToken, useValue: config },
    DatePipe,
    provideIsTimepicker(),
    provideIsCdk(),
  ]);
}
