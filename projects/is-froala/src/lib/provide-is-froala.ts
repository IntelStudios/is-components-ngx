import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { configToken } from './is-froala.component';
import { IsFroalaConfig } from './is-froala.interfaces';
import { IsFroalaService } from './is-froala.service';

export function provideIsFroala(config: IsFroalaConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: configToken, useValue: config },
    IsFroalaService,
  ]);
}
