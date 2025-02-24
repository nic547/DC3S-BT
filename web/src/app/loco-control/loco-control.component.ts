import { Component, inject } from '@angular/core';
import { BLEService } from '../ble.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loco-control',
  imports: [FormsModule],
  templateUrl: './loco-control.component.html',
  styleUrl: './loco-control.component.css'
})
export class LocoControlComponent {

  private ble = inject(BLEService);

  protected locoAddress = 3;

  async dccFunction(active: boolean) {
    await this.ble.setFunction(this.locoAddress, 0, active);
  }
}
