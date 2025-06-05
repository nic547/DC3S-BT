/// <reference types="web-bluetooth" />

import { Injectable, type WritableSignal, signal } from '@angular/core';
import type { IBLEService } from './ble.interface';

@Injectable({
    providedIn: 'root',
})
export class BleFakeService implements IBLEService {
    isLoading = signal(false);
    isReady = signal(false);
    isAvailable = signal(true);
    errorMessage: WritableSignal<null | string> = signal(null);
    IsFake = true;

    async setup() {
        console.log('BLEService setup');
        this.isReady.set(true);
    }

    async setFunction(address: number, number: number, state: boolean) {
        console.log('setFunction', address, number, state);
    }

    async setSpeed128(address: number, speed: number, forwards: boolean) {
        console.log('setSpeed128', address, speed, forwards);
    }
}
