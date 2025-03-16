import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineSelectionComponent } from './engine-selection.component';

describe('EngineSelectionComponent', () => {
  let component: EngineSelectionComponent;
  let fixture: ComponentFixture<EngineSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
