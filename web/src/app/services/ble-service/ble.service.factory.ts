import { BleFakeService } from "./ble-fake.service";
import { BLEService } from "./ble.service copy";

export class BLEServiceFactory {
    static create(): BleFakeService {
        let params = new URLSearchParams(document.location.search);
        let useFakeBle = params.get("fakeBle");
        if (useFakeBle) {
            return new BleFakeService();
        }
        return new BLEService();
    }
    
}