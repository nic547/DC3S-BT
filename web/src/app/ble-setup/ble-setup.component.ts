import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { NgIf } from '@angular/common';
import BLEServiceToken from '../services/ble-service/ble.interface';

@Component({
  selector: 'app-ble-setup',
  imports: [NgIf],
  templateUrl: './ble-setup.component.html',
  styleUrl: './ble-setup.component.css'
})
export class BLESetupComponent {

  protected bleService = inject(BLEServiceToken);

  async connect() {
    await this.bleService.setup();
  }
}
