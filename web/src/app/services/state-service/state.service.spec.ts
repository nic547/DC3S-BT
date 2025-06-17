import { TestBed } from '@angular/core/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { StateService } from './state.service';

describe('StateService', () => {
    let service: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(StateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
