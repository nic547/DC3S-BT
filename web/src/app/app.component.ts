import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BLESetupComponent } from './ble-setup/ble-setup.component';
import { BLEService } from './ble.service';
import { LocoControlComponent } from './loco-control/loco-control.component';
import { inject } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BLESetupComponent, LocoControlComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web';

  protected bleService = inject(BLEService);
}
