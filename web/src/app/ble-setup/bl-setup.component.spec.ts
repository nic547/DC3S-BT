import { provideZonelessChangeDetection } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BleFakeService } from '../services/ble-service/ble-fake.service';
import BLEServiceToken from '../services/ble-service/ble.interface';
import { BLESetupComponent } from './ble-setup.component';

describe('BLESetupComponent', () => {
    let component: BLESetupComponent;
    let fixture: ComponentFixture<BLESetupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BLESetupComponent],
            providers: [{ provide: BLEServiceToken, useValue: new BleFakeService() }, provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(BLESetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
