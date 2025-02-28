import { Component } from '@angular/core';
import { BLEService } from '../ble.service';
import { inject } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ble-setup',
  imports: [NgIf],
  templateUrl: './ble-setup.component.html',
  styleUrl: './ble-setup.component.css'
})
export class BLESetupComponent {

  protected bleService = inject(BLEService);

  async connect() {
    await this.bleService.setup();
  }
}
