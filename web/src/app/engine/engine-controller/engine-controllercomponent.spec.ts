import { provideZonelessChangeDetection } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BleFakeService } from '../../services/ble-service/ble-fake.service';
import BLEServiceToken from '../../services/ble-service/ble.interface';
import { SimpleEngine } from '../types';
import { EngineControllerComponent } from './engine-controller.component';

describe('LocoControlComponent', () => {
    let component: EngineControllerComponent;
    let fixture: ComponentFixture<EngineControllerComponent>;
    let mockEngine: SimpleEngine;

    beforeEach(async () => {
        // Create a mock SimpleEngine
        mockEngine = new SimpleEngine();
        mockEngine.address = 3;
        mockEngine.functions = [];
        mockEngine.isForwards = true;
        mockEngine.speed = 0;

        await TestBed.configureTestingModule({
            imports: [EngineControllerComponent],
            providers: [{ provide: BLEServiceToken, useValue: new BleFakeService() }, provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineControllerComponent);
        component = fixture.componentInstance;

        // Set the required engine input
        fixture.componentRef.setInput('engine', mockEngine);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
