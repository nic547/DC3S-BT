import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineRootComponent } from './engine-root.component';

describe('LocoContainerComponent', () => {
  let component: EngineRootComponent;
  let fixture: ComponentFixture<EngineRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineRootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
