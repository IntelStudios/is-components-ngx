import { OverlayModule } from '@angular/cdk/overlay';
import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';

import { IsCdkService } from './is-cdk.service';

export function provideIsCdk(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(OverlayModule),
    IsCdkService,
  ]);
}
