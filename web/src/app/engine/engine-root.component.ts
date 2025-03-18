import { Component, inject, signal } from '@angular/core';
import { StateService } from '../services/state-service/state.service';
import { DccFunction, SimpleEngine } from './types';
import { NgFor, NgIf } from '@angular/common';
import { EngineSelectionComponent } from './engine-selection/engine-selection.component';
import { EngineEditorComponent } from "./engine-editor/engine-editor.component";
import { EngineControllerComponent } from './engine-controller/engine-controller.component';

@Component({
  selector: 'app-engine-root',
  imports: [EngineControllerComponent, NgFor, NgIf, EngineSelectionComponent, EngineEditorComponent],
  templateUrl: './engine-root.component.html',
  styleUrl: './engine-root.component.css'
})
export class EngineRootComponent {

  protected stateService = inject(StateService);

  protected showSelection = signal(false);

  async addSimpleEngine() {
    let engine = new SimpleEngine();
    for (let i = 0; i <= 28; i++) {
      engine.functions.push(DccFunction.create(i));
    }
    await this.stateService.activateEngine(engine);
  }

  async selectEngine() {
    this.showSelection.set(true);
  }
}
