import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import BLEServiceToken from '../../services/ble-service/ble.interface';
import { Engine, PersistenEngine as PersistentEngine, SimpleEngine } from '../types';
import { StateService } from '../../services/state-service/state.service';
import { EditIconDirective } from '../../ui/edit-icon.directive';
import { CloseIconDirective } from '../../ui/close-icon.directive';
import { ArrowForwardIconDirective } from '../../ui/arrow-forward-icon.directive';
import { ArrowBackIconDirective } from '../../ui/arrow-back-icon.directive';

@Component({
  selector: 'app-engine-controller',
  imports: [FormsModule, CommonModule, CloseIconDirective, EditIconDirective, ArrowForwardIconDirective, ArrowBackIconDirective],
  templateUrl: './engine-controller.component.html',
  styleUrl: './engine-controller.component.css'
})
export class EngineControllerComponent implements OnInit {

  private ble = inject(BLEServiceToken);
  private static stateService: StateService | null = null;
  private stateService = inject(StateService);

  public engine = input.required<Engine>();
  public isSimpleEngine = computed(() => this.engine() instanceof SimpleEngine);
  public persistentEngine = computed(() => this.engine() as PersistentEngine); // bit of a hack to get around type narrowing not really working in the template
  protected static wideFunctions = signal(false);

  protected wideFunctions = EngineControllerComponent.wideFunctions;
  protected onResize = EngineControllerComponent.onResize;

  ngOnInit(): void {
    EngineControllerComponent.stateService = this.stateService;
    EngineControllerComponent.onResize();
  }
  
  async toggleFunction(number: number) {
    this.engine().functions[number].isActive = !this.engine().functions[number].isActive;
    console.log("toggleFunction", number, this.engine().functions[number].isActive);
    await this.ble.setFunction(this.engine().address, number, this.engine().functions[number].isActive);
  }

  async setDirection(forward: boolean) {
    this.engine().speed = 0;
    // Bit of a hack to get the slider to update
    (document.getElementById("speedSlider") as HTMLInputElement).value = "0";

    this.engine().isForwards = forward;
    
    console.log("setDirection",this.engine().speed, forward);
    await this.ble.setSpeed128(this.engine().address, this.engine().speed, forward);
  }

  async setSpeed() {
    console.log("setSpeed", this.engine().speed, this.engine().isForwards);
    await this.ble.setSpeed128(this.engine().address, this.engine().speed, this.engine().isForwards);
  }

  editEngine() {
    this.stateService.editingEngine.set(this.persistentEngine());
  }
  
  deactivateEngine() {
    this.stateService.deactivateEngine(this.engine());
    EngineControllerComponent.onResize();
  }

  protected static onResize() {
    const clientWidth = document.documentElement.clientWidth;
    const engines = this.stateService?.activeEngines().length ?? 0;
    clientWidth / engines > 600 ? this.wideFunctions.set(true) : this.wideFunctions.set(false);
  }
}