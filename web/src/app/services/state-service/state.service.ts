import { Injectable, signal, WritableSignal } from '@angular/core';
import { Engine, PersistenEngine } from '../../engine/types';
@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  private activeEnginesSignal: WritableSignal<Engine[]> = signal([]);
  get activeEngines() {
    return this.activeEnginesSignal.asReadonly();
  }

  public editingEngine: WritableSignal<PersistenEngine | null> = signal(null);

  public async activateEngine(engine: Engine): Promise<void> {
    this.activeEnginesSignal.update(v => [...v, engine]);
  }
}
