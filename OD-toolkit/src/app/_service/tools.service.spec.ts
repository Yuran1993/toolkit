import { TestBed } from '@angular/core/testing';

import { GetUser } from './getUser.service';

describe('GetUser', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetUser = TestBed.get(GetUser);
    expect(service).toBeTruthy();
  });
});
