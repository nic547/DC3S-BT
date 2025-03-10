import { Component, inject } from '@angular/core';
import { LocoControlComponent } from '../loco-control/loco-control.component';
import { StateService } from '../services/state-service/state.service';
import { DccFunction, SimpleEngine } from '../lib/engines';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-loco-container',
  imports: [LocoControlComponent, NgFor],
  templateUrl: './loco-container.component.html',
  styleUrl: './loco-container.component.css'
})
export class LocoContainerComponent {

  protected stateService = inject(StateService);

  async addSimpleEngine() {
    let engine = new SimpleEngine();
    for (let i = 0; i <= 28; i++) {
      engine.functions.push(DccFunction.create(i));
    }
    await this.stateService.activateEngine(engine);
  }
}
