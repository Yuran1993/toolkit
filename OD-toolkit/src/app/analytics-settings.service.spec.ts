import { TestBed } from '@angular/core/testing';

import { AnalyticsSettingsService } from './analytics-settings.service';

describe('AnalyticsSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticsSettingsService = TestBed.get(AnalyticsSettingsService);
    expect(service).toBeTruthy();
  });
});
