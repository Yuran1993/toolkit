import { TestBed } from '@angular/core/testing';

import { authService } from './auth.service';

describe('authService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: authService = TestBed.get(authService);
    expect(service).toBeTruthy();
  });
});
