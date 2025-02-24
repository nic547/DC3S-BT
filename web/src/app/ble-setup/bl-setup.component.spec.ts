import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLESetupComponent } from './ble-setup.component';

describe('BLESetupComponent', () => {
  let component: BLESetupComponent;
  let fixture: ComponentFixture<BLESetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BLESetupComponent]
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
