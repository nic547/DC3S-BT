import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineEditorComponent } from './engine-editor.component';

describe('EngineEditorComponent', () => {
  let component: EngineEditorComponent;
  let fixture: ComponentFixture<EngineEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
