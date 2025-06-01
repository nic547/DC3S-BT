import { BleFakeService } from './ble-fake.service';
import { BLEService } from './ble.service';

export class BLEServiceFactory {
    static create(): BleFakeService {
        const params = new URLSearchParams(document.location.search);
        const useFakeBle = params.get('fakeBle');
        if (useFakeBle === 'true') {
            return new BleFakeService();
        }
        return new BLEService();
    }
}
