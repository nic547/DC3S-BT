import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineControllerComponent } from './engine-controller.component';

describe('LocoControlComponent', () => {
  let component: EngineControllerComponent;
  let fixture: ComponentFixture<EngineControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineControllerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
