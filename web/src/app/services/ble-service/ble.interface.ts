import { Signal, InjectionToken } from "@angular/core";

export interface IBLEService {
    setup(): Promise<void>;
    setSpeed128(address: number, speed: number, forwards: boolean): Promise<void>;
    setFunction(address: number, number: number, state: boolean): Promise<void>;

    isLoading: Signal<boolean>
    isReady: Signal<boolean>
    isAvailable: Signal<boolean>
    errorMessage: Signal<null | string>;

}

 const BLEServiceToken = new InjectionToken<IBLEService>('IBLEService');
 export default BLEServiceToken;