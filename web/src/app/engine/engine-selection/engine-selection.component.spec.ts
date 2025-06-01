import { provideZonelessChangeDetection } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineSelectionComponent } from './engine-selection.component';

describe('EngineSelectionComponent', () => {
    let component: EngineSelectionComponent;
    let fixture: ComponentFixture<EngineSelectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EngineSelectionComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
