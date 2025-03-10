import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocoContainerComponent } from './loco-container.component';

describe('LocoContainerComponent', () => {
  let component: LocoContainerComponent;
  let fixture: ComponentFixture<LocoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocoContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
