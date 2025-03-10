import { Injectable, signal, WritableSignal } from '@angular/core';
import { Engine } from '../../lib/engines';
@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  private activeEnginesSignal: WritableSignal<Engine[]> = signal([]);
  get activeEngines() {
    return this.activeEnginesSignal.asReadonly();
  }

  public async activateEngine(engine: Engine): Promise<void> {
    this.activeEnginesSignal.update(v => [...v, engine]);
  }
}
