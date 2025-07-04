import { Injectable, type WritableSignal, signal } from '@angular/core';
import type { Engine, PersistenEngine } from '../../engine/types';
@Injectable({
    providedIn: 'root',
})
export class StateService {

    private activeEnginesSignal: WritableSignal<Engine[]> = signal([]);
    get activeEngines() {
        return this.activeEnginesSignal.asReadonly();
    }

    public editingEngine: WritableSignal<PersistenEngine | null> = signal(null);

    public activateEngine(engine: Engine): void {
        if (this.activeEnginesSignal().includes(engine)) {
            console.warn('Engine is already active:', engine);
            return;
        }

        this.activeEnginesSignal.update((v) => [...v, engine]);
    }

    public deactivateEngine(engine: Engine): void {
        this.activeEnginesSignal.update((v) => v.filter((e) => e !== engine));
    }
}
