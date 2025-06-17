import { TestBed } from '@angular/core/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { BleFakeService } from './ble-fake.service';

describe('BleFakeService', () => {
    let service: BleFakeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(BleFakeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
