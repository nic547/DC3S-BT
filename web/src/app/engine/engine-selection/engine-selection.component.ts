import { AfterViewInit, Component, ElementRef, inject, input, model, OnInit, ViewChild } from '@angular/core';
import { StateService } from '../../services/state-service/state.service';
import { Engine, PersistenEngine as PersistentEngine } from '../types';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { EditIconDirective } from '../../ui/edit-icon.directive';
import { DeleteIconDirective } from '../../ui/delete-icon.directive';
import { DownloadIconDirective } from '../../ui/download-icon.directive';
import { TransferService } from '../../services/transfer-service/transfer.service';

@Component({
  selector: 'app-engine-selection',
  imports: [CommonModule, EditIconDirective, DeleteIconDirective, DownloadIconDirective],
  templateUrl: './engine-selection.component.html',
  styleUrl: './engine-selection.component.css'
})
export class EngineSelectionComponent implements OnInit, AfterViewInit {


  public showSelection = model.required<boolean>()

  private stateService = inject(StateService)
  private dataService = inject(DataService)
  private transferService = inject(TransferService)

  protected engines: PersistentEngine[] = []

  @ViewChild('selectionDialog') engineSelectionDialog: ElementRef<HTMLDialogElement> | null = null

  async ngOnInit(): Promise<void> {
    this.engines = await this.dataService.getEngines();
  }

  async ngAfterViewInit(): Promise<void> {
    this.engineSelectionDialog?.nativeElement.showModal();
  }

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

  public async deleteEngine(engine: PersistentEngine) {
    await this.dataService.deleteEngine(engine);
    this.engines = await this.dataService.getEngines();

  }

  public async editEngine(engine: PersistentEngine) {
    this.stateService.editingEngine.set(engine);
    this.close();
  }

  public async exportEngine(engine: PersistentEngine) {
    const text = await this.transferService.exportEngine(engine);
    console.log(text);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/gzip;base64,' + text);
    element.setAttribute('download', this.getSaveishName(engine.name) + '.json.gz');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public getSaveishName(name: string): string {
    return name.replace(/[^a-z0-9().]/gi, '_');
  }

  public async importEngine() {

    const pickerOpts: OpenFilePickerOptions = {
      types: [
        {
          description: ".json.gz",
          accept: {
            "application/gzip": [".json.gz"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };

    try {
      let fileHandlers = await window.showOpenFilePicker(pickerOpts);
      if (fileHandlers.length > 0) {
        const fileHandler = fileHandlers[0];
        const file = await fileHandler.getFile();
        
        // Use the transfer service to decompress and parse the file
        const importedEngine = await this.transferService.importEngine(file);
        
        // Save the imported engine
        await this.dataService.addOrUpdateEngine(importedEngine);
        
      }
    } catch (error) {
      console.error('Error importing engine:', error);
      // You might want to add some user-facing error handling here
    }
    this.engines = await this.dataService.getEngines();
  }
}
