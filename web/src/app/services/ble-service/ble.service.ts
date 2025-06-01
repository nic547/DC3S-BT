/// <reference types="web-bluetooth" />

import { Injectable, type WritableSignal, signal } from '@angular/core';
import type { IBLEService } from './ble.interface';

@Injectable({
    providedIn: 'root',
})
export class BLEService implements IBLEService {
    constructor() {
        if (!navigator.bluetooth) {
            this.isAvailable.set(false);
            this.errorMessage.set('Web Bluetooth is not available on this device/browser');
            return;
        }

        if (!navigator.bluetooth.getAvailability()) {
            this.isAvailable.set(false);
            this.errorMessage.set('Bluetooth is not available on this device/browser');
            return;
        }
    }

    isLoading = signal(false);
    isReady = signal(false);
    isAvailable = signal(true);
    errorMessage: WritableSignal<null | string> = signal(null);
    IsFake = false;

    private functionCommand: BluetoothRemoteGATTCharacteristic | null = null;
    private Speed128Command: BluetoothRemoteGATTCharacteristic | null = null;

    async setup() {
        try {
            console.log('BLEService setup');
            const resuestOptions: RequestDeviceOptions = {
                filters: [{ services: ['789624c2-214b-4730-b53d-fe5aa3143250'] }],
                optionalServices: ['6d3fe63e-4083-483a-ab0c-36113ecb859f'],
            };

            this.isLoading.set(true);

            const device = await navigator.bluetooth.requestDevice(resuestOptions);
            const server = await device.gatt?.connect();

            if (!server) {
                throw new Error('No GATT server found');
            }
            await this.loadCharacteristics(server);
        } catch (error: any) {
            this.errorMessage.set(error?.message ?? 'An unknown error occurred');
            console.error(error);
            this.isLoading.set(false);
            return;
        }

        this.isReady.set(true);
        this.isLoading.set(false);
    }

    private commandQueue: Promise<void> = Promise.resolve();
    private pendingCommands: Map<string, { args: any[]; execute: () => Promise<void> }> = new Map();

    private enqueueCommand(key: string, args: any[], execute: () => Promise<void>): Promise<void> {
        // Check if a command with the same key is already pending
        if (this.pendingCommands.has(key)) {
            // Replace the pending command with the latest one
            this.pendingCommands.set(key, { args, execute });
            return this.commandQueue;
        }

        // Add the new command to the queue
        this.pendingCommands.set(key, { args, execute });
        this.commandQueue = this.commandQueue
            .then(async () => {
                // Execute the latest version of the command
                const command = this.pendingCommands.get(key);
                if (command) {
                    this.pendingCommands.delete(key);
                    await command.execute();
                }
            })
            .catch((error) => {
                console.error('Error in command execution:', error);
            });

        return this.commandQueue;
    }

    async setSpeed128(address: number, speed: number, forwards: boolean) {
        await this.enqueueCommand(
            `setSpeed128-${address}`, // Unique key for folding based on address
            [address, speed, forwards],
            async () => {
                const buffer = new ArrayBuffer(4);
                const view = new DataView(buffer);
                view.setUint16(0, address, true);
                view.setUint8(2, speed);
                view.setUint8(3, forwards ? 1 : 0);

                await this.Speed128Command?.writeValue(buffer);
            },
        );
    }

    async setFunction(address: number, number: number, state: boolean) {
        await this.enqueueCommand(
            `setFunction-${address}-${number}`, // Unique key for folding based on address and function number
            [address, number, state],
            async () => {
                const buffer = new ArrayBuffer(4);
                const view = new DataView(buffer);
                view.setUint16(0, address, true);
                view.setUint8(2, number);
                view.setUint8(3, state ? 1 : 0);

                await this.functionCommand?.writeValue(buffer);
            },
        );
    }

    private async loadCharacteristics(server: BluetoothRemoteGATTServer) {
        const mainService = await server.getPrimaryService('789624c2-214b-4730-b53d-fe5aa3143250');
        const locoService = await server.getPrimaryService('6d3fe63e-4083-483a-ab0c-36113ecb859f');
        this.functionCommand = await locoService.getCharacteristic('4d550020-9408-4c08-a9c0-904ead62a642');
        this.Speed128Command = await locoService.getCharacteristic('a829de9a-6dff-4500-ad7b-90889ef346c0');
        console.log(await this.functionCommand.readValue());
    }
}
