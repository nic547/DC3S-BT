import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLESetupComponent } from './ble-setup.component';
import BLEServiceToken from '../services/ble-service/ble.interface';
import { BleFakeService } from '../services/ble-service/ble-fake.service';

describe('BLESetupComponent', () => {
  let component: BLESetupComponent;
  let fixture: ComponentFixture<BLESetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BLESetupComponent],
      providers: [{provide: BLEServiceToken, useValue: new BleFakeService()}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BLESetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
