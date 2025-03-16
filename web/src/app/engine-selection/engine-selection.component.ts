import { Component, inject, input, model, OnInit } from '@angular/core';
import { StateService } from '../services/state-service/state.service';
import { Engine, PersistenEngine as PersistentEngine } from '../lib/engines';
import { DataService } from '../services/data-service/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-engine-selection',
  imports: [CommonModule],
  templateUrl: './engine-selection.component.html',
  styleUrl: './engine-selection.component.css'
})
export class EngineSelectionComponent implements OnInit {

  async ngOnInit(): Promise<void> {
    this.engines = await this.dataService.getEngines();
  }

  public showSelection = model.required<boolean>()
  
  private stateService = inject(StateService)
  private dataService = inject(DataService)

  protected engines: PersistentEngine[] = []

  public async createNewPersistentEngine() {
    this.stateService.editingEngine.set(new PersistentEngine());
    this.close()
  }

  public close() {
    this.showSelection.set(false)
  }

  public select(engine: Engine) {
    this.stateService.activateEngine(engine);
    this.close();
  }
}
