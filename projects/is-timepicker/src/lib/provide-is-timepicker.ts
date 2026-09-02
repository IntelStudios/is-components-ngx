import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideIsCdk } from '@intelstudios/cdk';
import { provideNgxMask } from 'ngx-mask';

export function provideIsTimepicker(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideNgxMask(),
    provideIsCdk(),
  ]);
}
