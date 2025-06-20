import { type AfterContentInit, Component, type ElementRef, type OnInit, ViewChild, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BLEServiceToken } from '../../services/ble-service/ble.interface';
import { DataService } from '../../services/data-service/data.service';
import { StateService } from '../../services/state-service/state.service';
import { IconModule } from '../../ui/icon.module';
import { type Engine, PersistenEngine as PersistentEngine, SimpleEngine } from '../types';

@Component({
    selector: 'app-engine-controller',
    imports: [FormsModule, IconModule],
    templateUrl: './engine-controller.component.html',
    styleUrl: './engine-controller.component.css',
})
export class EngineControllerComponent implements OnInit, AfterContentInit {
    @ViewChild('speedSlider') speedSlider: ElementRef<HTMLInputElement> | undefined;
    private ble = inject(BLEServiceToken);
    private data = inject(DataService);
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

    ngAfterContentInit(): void {
        this.resetStateIfRequired();
        // relies on the slider existing to set the initial gradient
        this.updateSliderGradient();
    }

    async toggleFunction(number: number) {
        this.engine().functions[number].isActive = !this.engine().functions[number].isActive;
        console.log('toggleFunction', number, this.engine().functions[number].isActive);
        await this.ble.setFunction(this.engine().address, number, this.engine().functions[number].isActive);

        if (!this.isSimpleEngine()) {
            await this.data.addOrUpdateEngine(this.persistentEngine());
        }
    }

    async setDirection(forward: boolean) {
        this.engine().speed = 0;
        // Bit of a hack to get the slider to update
        (document.getElementById('speedSlider') as HTMLInputElement).value = '0';
        this.updateSliderGradient();

        this.engine().isForwards = forward;

        console.log('setDirection', this.engine().speed, forward);
        await this.ble.setSpeed128(this.engine().address, this.engine().speed, forward);
        if (!this.isSimpleEngine()) {
            await this.data.addOrUpdateEngine(this.persistentEngine());
        }
    }

    async setSpeed() {
        console.log('setSpeed', this.engine().speed, this.engine().isForwards);
        await this.ble.setSpeed128(this.engine().address, this.engine().speed, this.engine().isForwards);

        this.updateSliderGradient();
        if (!this.isSimpleEngine()) {
            await this.data.addOrUpdateEngine(this.persistentEngine());
        }
    }

    editEngine() {
        this.stateService.editingEngine.set(this.persistentEngine());
    }

    deactivateEngine() {
        this.stateService.deactivateEngine(this.engine());
        EngineControllerComponent.onResize();
    }

    protected updateSliderGradient() {
        const value = (this.engine().speed / 126) * 100;
        this.speedSlider?.nativeElement.style.setProperty('--value', `${value}%`);
    }

    protected static onResize() {
        const clientWidth = window.innerWidth;
        const engines = EngineControllerComponent.stateService?.activeEngines().length ?? 0;
        let availableWidthPerElement = clientWidth / engines;
        availableWidthPerElement > 600
            ? EngineControllerComponent.wideFunctions.set(true)
            : EngineControllerComponent.wideFunctions.set(false);

        if (availableWidthPerElement > 800) {
            availableWidthPerElement = 800;
        }

        if (availableWidthPerElement < 400) {
            availableWidthPerElement = 400;
        }

        document.documentElement.style.setProperty('--engine-controller-width', `${availableWidthPerElement}px`);
    }

    protected resetStateIfRequired() {
        const engine = this.engine();

        if (engine instanceof PersistentEngine && ( this.ble.sessionUuid() !== engine.lastActiveSession || engine.lastActiveSession === null)) {
            engine.speed = 0;
            engine.isForwards = true;
            engine.lastActiveSession = this.ble.sessionUuid();
            for (const f of engine.functions) {
                f.isActive = false;
            }
            this.data.addOrUpdateEngine(engine);
        }
    }
}
