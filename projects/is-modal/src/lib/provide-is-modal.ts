import { Overlay } from '@angular/cdk/overlay';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideIsCdk } from '@intelstudios/cdk';

import { IsModalMovableService } from './is-modal-movable.service';
import { IsModalService } from './is-modal.service';

export function provideIsModal(): EnvironmentProviders {
  return makeEnvironmentProviders([
    IsModalService,
    IsModalMovableService,
    Overlay,
    provideIsCdk(),
  ]);
}
