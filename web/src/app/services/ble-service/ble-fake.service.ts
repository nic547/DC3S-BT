/// <reference types="web-bluetooth" />

import { Injectable, WritableSignal, signal } from '@angular/core';
import { IBLEService as IBLEService } from './ble.interface';

@Injectable({
  providedIn: 'root'
})
export class BleFakeService implements IBLEService {

  constructor() {}

  isLoading = signal(false);
  isReady = signal(false);
  isAvailable = signal(true);
  errorMessage: WritableSignal<null | string> = signal(null)

  async setup() {
    console.log("BLEService setup");
        this.isReady.set(true);
  }

  async setFunction(address: number, number: number, state: boolean) {
    console.log("setFunction", address, number, state);
  }

  async setSpeed128(address: number, speed: number, forwards: boolean) {
    console.log("setSpeed128", address, speed, forwards);
  }
}