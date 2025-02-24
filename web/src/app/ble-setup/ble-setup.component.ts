import { Component } from '@angular/core';
import { BLEService } from '../ble.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-ble-setup',
  imports: [],
  templateUrl: './ble-setup.component.html',
  styleUrl: './ble-setup.component.css'
})
export class BLESetupComponent {

  private bleService = inject(BLEService);

  async connect() {
    await this.bleService.setup();
  }
}
