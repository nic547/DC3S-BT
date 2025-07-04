import { Component, inject, signal } from '@angular/core';
import { StateService } from '../services/state-service/state.service';
import { DccFunction, PersistenEngine, SimpleEngine } from './types';

import { state } from '@angular/animations';
import { EngineControllerComponent } from './engine-controller/engine-controller.component';
import { EngineEditorComponent } from './engine-editor/engine-editor.component';
import { EngineSelectionComponent } from './engine-selection/engine-selection.component';

@Component({
    selector: 'app-engine-root',
    imports: [EngineControllerComponent, EngineSelectionComponent, EngineEditorComponent],
    templateUrl: './engine-root.component.html',
    styleUrl: './engine-root.component.css',
})
export class EngineRootComponent {
    protected stateService = inject(StateService);

    protected showSelection = signal(false);

    async createSimpleEngine() {
        const engine = new SimpleEngine();
        for (let i = 0; i <= 28; i++) {
            engine.functions.push(DccFunction.create(i));
        }
        await this.stateService.activateEngine(engine);
    }

    async createPersistentEngine() {
        const engine = new PersistenEngine();
        this.stateService.editingEngine.set(engine);
    }

    async selectEngine() {
        this.showSelection.set(true);
    }
}
