import { AfterViewInit, Component, computed, ElementRef, inject, input, model, OnInit, Resource, Signal, signal, ViewChild, resource, linkedSignal, WritableResource } from '@angular/core';
import { StateService } from '../../services/state-service/state.service';
import { Engine, PersistenEngine as PersistentEngine } from '../types';
import { DataService } from '../../services/data-service/data.service';

import { IconModule } from '../../ui/icon.module';
import { TransferService } from '../../services/transfer-service/transfer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-engine-selection',
  imports: [FormsModule, IconModule],
  templateUrl: './engine-selection.component.html',
  styleUrl: './engine-selection.component.css'
})
export class EngineSelectionComponent implements AfterViewInit {


  public showSelection = model.required<boolean>()

  private stateService = inject(StateService)
  private dataService = inject(DataService)
  private transferService = inject(TransferService)

  protected engines: WritableResource<PersistentEngine[]> = resource({
    params: () => ({ searchTerm: this.searchTerm(), sortKey: this.sortKey(), desc: this.desc() }),
    loader: async ({ params }) => {
      return await this.dataService.getEngines(params.searchTerm, params.sortKey, params.desc);
    },
    defaultValue: [],
  })

  protected searchTerm = signal<string>('')
  protected sortKey = signal<'lastUsed' | 'name' | 'created' | 'address'>('lastUsed')
  protected desc = signal<boolean>(true)

  protected showFallbackFileSelector = signal(false);

  @ViewChild('selectionDialog') engineSelectionDialog: ElementRef<HTMLDialogElement> | null = null

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
    this.engines.reload();
  }

  public async editEngine(engine: PersistentEngine) {
    this.stateService.editingEngine.set(engine);
    this.close();
  }

  public async exportEngine(engine: PersistentEngine) {
    const text = await this.transferService.exportEngine(engine);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/gzip;base64,' + text);
    element.setAttribute('download', this.getSaveishName(engine.name) + '.json.gz');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public async exportAllEngines() {
    const engines = await this.dataService.getEngines();
    const text = await this.transferService.exportEngines(engines);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/gzip;base64,' + text);
    element.setAttribute('download', 'dc3s_engines.json.gz');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public async setSearchTerm(searchTerm: string) {
    this.searchTerm.set(searchTerm);
  }

  public clearSearchTerm() {
    this.searchTerm.set('');
  }


  public getSaveishName(name: string): string {
    return name.replace(/[\/\\.<>:*"?|]/gi, '_');
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
        const importedEngines = await this.transferService.importEngine(file);

        for (const engine of importedEngines) {
          await this.dataService.addOrUpdateEngine(engine);
        }

      }
    } catch (error) {
      this.showFallbackFileSelector.set(true);
    }
    this.engines.reload();
  }

  async FallbackFileInputChanged(event: Event) {
    const input = event?.target as HTMLInputElement;
    const importedEngines = input.files?.[0] && await this.transferService.importEngine(input.files[0])

    for (const engine of importedEngines ?? []) {
      await this.dataService.addOrUpdateEngine(engine);
    }

    this.engines.reload();
    this.showFallbackFileSelector.set(false);
  }

  closeFallbackFileSelector() {
    this.showFallbackFileSelector.set(false);
  }
}
