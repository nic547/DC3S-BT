import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BLESetupComponent } from './ble-setup/ble-setup.component';
import BLEServiceToken, { IBLEService } from './services/ble-service/ble.interface';
import { inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { BLEServiceFactory } from './services/ble-service/ble.service.factory';
import { LocoContainerComponent } from './loco-container/loco-container.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BLESetupComponent, LocoContainerComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{provide: BLEServiceToken, useFactory: BLEServiceFactory.create}]
})
export class AppComponent {
  title = 'web';

  protected bleService = inject(BLEServiceToken);
}
