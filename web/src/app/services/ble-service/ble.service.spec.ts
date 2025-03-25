import { TestBed } from '@angular/core/testing';
import { BLEService } from './ble.service';

describe('BLEService', () => {
  let service: BLEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BLEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
