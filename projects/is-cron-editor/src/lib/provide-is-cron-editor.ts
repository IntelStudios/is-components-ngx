import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideIsCoreUi } from '@intelstudios/core-ui';
import { provideIsSelect } from '@intelstudios/select';

export function provideIsCronEditor(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideIsSelect(),
    provideIsCoreUi(),
  ]);
}
