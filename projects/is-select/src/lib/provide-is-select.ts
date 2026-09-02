import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideIsCdk } from '@intelstudios/cdk';

import { configToken, createDefaultConfig, IsSelectConfig } from './is-select.interfaces';

export function provideIsSelect(config?: IsSelectConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideIsCdk(),
    { provide: configToken, useValue: { ...createDefaultConfig(), ...config } },
  ]);
}
