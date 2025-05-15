import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { EngineEditorComponent } from './engine-editor.component';

describe('EngineEditorComponent', () => {
  let component: EngineEditorComponent;
  let fixture: ComponentFixture<EngineEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineEditorComponent],
      providers: [provideExperimentalZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set functions when set via numbers', () => {
    component['numberOfFunctions'] = 5;
    component.handleFunctionNumberChange();

    expect(component['engine'].functions.length).toBe(5);
    expect(component['engine'].functions[4].number).toBe(4);
  });
});
