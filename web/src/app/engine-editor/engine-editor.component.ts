import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../services/state-service/state.service';
import { PersistenEngine } from '../lib/engines';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data-service/data.service';

@Component({
  selector: 'app-engine-editor',
  imports: [FormsModule, CommonModule],
  templateUrl: './engine-editor.component.html',
  styleUrl: './engine-editor.component.css'
})
export class EngineEditorComponent implements OnInit {

  private stateService = inject(StateService);
  private dataService = inject(DataService);

  protected engine: PersistenEngine = new PersistenEngine(); //Placeholder to not screw around with null/undefined

  protected tagInput: string = '';

  ngOnInit(): void {
    let engine = this.stateService.editingEngine();
    if (engine == null) {
      console.error('EngineEditorComponent loaded with a null value in stateService.editingEngine()');
      return;
    }
    this.engine = structuredClone(engine);
  }

  save() {
    let existingEngine = this.stateService.activeEngines().find(e => e instanceof PersistenEngine && e.id === this.engine.id) as PersistenEngine | undefined;
    if (existingEngine) {
      existingEngine.updateWith(this.engine);
      this.dataService.addOrUpdateEngine(existingEngine);
    }
    else {
      this.stateService.activateEngine(this.engine);
      this.dataService.addOrUpdateEngine(this.engine);
    }
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

}
