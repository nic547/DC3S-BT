import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocoControlComponent } from './loco-control.component';

describe('LocoControlComponent', () => {
  let component: LocoControlComponent;
  let fixture: ComponentFixture<LocoControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocoControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
