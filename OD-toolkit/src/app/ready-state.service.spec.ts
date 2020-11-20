import { TestBed } from '@angular/core/testing';

import { ReadyStateService } from './ready-state.service';

describe('ReadyStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadyStateService = TestBed.get(ReadyStateService);
    expect(service).toBeTruthy();
  });
});
