import { type AfterViewInit, Component, type ElementRef, type OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state-service/state.service';
import { DccFunction, PersistenEngine } from '../types';

import { DataService } from '../../services/data-service/data.service';
import { IconModule } from '../../ui/icon.module';

@Component({
    selector: 'app-engine-editor',
    imports: [FormsModule, IconModule],
    templateUrl: './engine-editor.component.html',
    styleUrl: './engine-editor.component.css',
})
export class EngineEditorComponent implements OnInit, AfterViewInit {
    private stateService = inject(StateService);
    private dataService = inject(DataService);

    public engine: PersistenEngine = new PersistenEngine(); //Placeholder to not screw around with null/undefined

    public tagInput = '';

    public numberOfFunctions = 0;

    @ViewChild('engineEditor') engineEditorDialog: ElementRef<HTMLDialogElement> | null = null;

    ngOnInit(): void {
        const engine = this.stateService.editingEngine();
        if (engine == null) {
            console.error('EngineEditorComponent loaded with a null value in stateService.editingEngine()');
            return;
        }
        this.engine = structuredClone(engine);
        this.numberOfFunctions = this.engine.functions.length;
    }

    ngAfterViewInit(): void {
        this.engineEditorDialog?.nativeElement.showModal();
    }

    async save() {
        this.engine.lastModified = new Date();
        const existingEngine = await this.dataService.getEngine(this.engine.id);
        if (existingEngine) {
            existingEngine.updateWith(this.engine);
            this.dataService.addOrUpdateEngine(existingEngine);

            const activeEngine = this.stateService
                .activeEngines()
                .find((e) => e instanceof PersistenEngine && e.id === existingEngine.id) as PersistenEngine;
            if (activeEngine) {
                activeEngine.updateWith(existingEngine);
            } else {
                this.stateService.activateEngine(existingEngine);
            }
        } else {
            this.stateService.activateEngine(this.engine);
            this.dataService.addOrUpdateEngine(this.engine);
        }
        this.stateService.editingEngine.set(null);
    }

    cancel() {
        this.stateService.editingEngine.set(null);
    }

    addTag() {
        if (this.tagInput.trim() === '') return;
        this.engine.tags.push(this.tagInput.trim());
        this.tagInput = '';
    }

    removeTag(tag: string) {
        const index = this.engine.tags.indexOf(tag);
        if (index > -1) {
            this.engine.tags.splice(index, 1);
        }
    }

    handleTagInputKeypress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.addTag();
        }
    }

    handleFunctionNumberChange() {
        const difference = this.engine.functions.length - this.numberOfFunctions;
        if (difference > 0) {
            this.engine.functions.splice(this.numberOfFunctions, difference);
        } else if (difference < 0) {
            for (let i = 0; i < -difference; i++) {
                this.engine.functions.push(DccFunction.create(this.engine.functions.length));
            }
        }
    }

    addFunction() {
        this.numberOfFunctions++;
        this.handleFunctionNumberChange();
    }

    removeFunction() {
        this.numberOfFunctions--;
        this.handleFunctionNumberChange();
    }
}
