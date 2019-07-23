import { TestBed } from '@angular/core/testing';

import { IsCheckmapService } from './is-checkmap.service';

describe('IsCheckmapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsCheckmapService = TestBed.get(IsCheckmapService);
    expect(service).toBeTruthy();
  });
});
