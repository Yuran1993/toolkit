import { TestBed } from '@angular/core/testing';

import { InputDataControllerService } from './input-data-controller.service';

describe('InputDataControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputDataControllerService = TestBed.get(InputDataControllerService);
    expect(service).toBeTruthy();
  });
});
