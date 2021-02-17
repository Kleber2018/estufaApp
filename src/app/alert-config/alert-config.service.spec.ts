import { TestBed } from '@angular/core/testing';

import { AlertConfigService } from './alert-config.service';

describe('AlertConfigService', () => {
  let service: AlertConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
