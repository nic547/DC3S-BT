import { TestBed } from '@angular/core/testing';

import { BleFakeService } from './ble-fake.service';

describe('BleFakeService', () => {
  let service: BleFakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BleFakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
