import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BLEService } from './ble.service';

describe('BLEService', () => {
    let service: BLEService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(BLEService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
