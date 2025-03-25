/// <reference types="web-bluetooth" />

import { Injectable, WritableSignal, signal } from '@angular/core';
import { IBLEService as IBLEService } from './ble.interface';

@Injectable({
  providedIn: 'root'
})
export class BLEService implements IBLEService {

  constructor() {
    if (!navigator.bluetooth) {
      this.isAvailable.set(false);
      this.errorMessage.set("Web Bluetooth is not available on this device/browser");
      return;
    }

    if (!navigator.bluetooth.getAvailability()) {
      this.isAvailable.set(false);
      this.errorMessage.set("Bluetooth is not available on this device/browser");
      return;
    }
  }

  isLoading = signal(false);
  isReady = signal(false);
  isAvailable = signal(true);
  errorMessage: WritableSignal<null | string> = signal(null)

  private functionCommand: BluetoothRemoteGATTCharacteristic | null = null;
  private Speed128Command: BluetoothRemoteGATTCharacteristic | null = null;

  async setup() {
    try {
     
    console.log("BLEService setup");
    let resuestOptions: RequestDeviceOptions = {
      filters: [{ services: ['789624c2-214b-4730-b53d-fe5aa3143250'] }],
      optionalServices: ['6d3fe63e-4083-483a-ab0c-36113ecb859f']
    };

    this.isLoading.set(true);

    let device = await navigator.bluetooth.requestDevice(resuestOptions);
    let server = await device.gatt?.connect();

    if (!server) {
      throw new Error("No GATT server found");
    }
    await this.loadCharacteristics(server);

    }

    catch (error: any) {
      this.errorMessage.set(error?.message ?? "An unknown error occurred");
      console.error(error);
      this.isLoading.set(false);
      return
    }

    this.isReady.set(true);
    this.isLoading.set(false);
  }

  async setFunction(address: number, number: number, state: boolean) {
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    view.setUint16(0, address, true);
    view.setUint8(2, number);
    view.setUint8(3, state ? 1 : 0);

    this.functionCommand?.writeValue(buffer);
  }

  async setSpeed128(address: number, speed: number, forwards: boolean) {
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    view.setUint16(0, address, true);
    view.setUint8(2, speed);
    view.setUint8(3, forwards ? 1 : 0);

    this.Speed128Command?.writeValue(buffer);
  }

  private async loadCharacteristics(server: BluetoothRemoteGATTServer) {
    const mainService = await server.getPrimaryService('789624c2-214b-4730-b53d-fe5aa3143250');
    const locoService = await server.getPrimaryService('6d3fe63e-4083-483a-ab0c-36113ecb859f');
    this.functionCommand = await locoService.getCharacteristic('4d550020-9408-4c08-a9c0-904ead62a642');
    this.Speed128Command = await locoService.getCharacteristic('a829de9a-6dff-4500-ad7b-90889ef346c0');
    console.log(await this.functionCommand.readValue());
  }
}