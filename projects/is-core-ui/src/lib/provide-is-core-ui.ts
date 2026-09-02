import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { configToken, IsCoreUIConfig } from './is-core-ui.interfaces';

export function provideIsCoreUi(config?: IsCoreUIConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: configToken, useValue: config },
  ]);
}
