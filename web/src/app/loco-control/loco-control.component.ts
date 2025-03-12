import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import BLEServiceToken from '../services/ble-service/ble.interface';
import { Engine } from '../lib/engines';

@Component({
  selector: 'app-loco-control',
  imports: [FormsModule, NgFor],
  templateUrl: './loco-control.component.html',
  styleUrl: './loco-control.component.css'
})
export class LocoControlComponent {

  private ble = inject(BLEServiceToken);

  public engine = input.required<Engine>();

  async toggleFunction(number: number) {
    await this.ble.setFunction(this.engine().address, number, !this.engine().functions[number].isActive);
    this.engine().functions[number].isActive = !this.engine().functions[number].isActive;
    console.log("toggleFunction", number, this.engine().functions[number].isActive);
  }

  async setDirection(forward: boolean) {
    this.engine().speed = 0;
    // Bit of a hack to get the slider to update
    (document.getElementById("speedSlider") as HTMLInputElement).value = "0";
    await ui();

    this.engine().isForwards = forward;
    await this.ble.setSpeed128(this.engine().address, this.engine().speed, forward);
    console.log("setDirection",this.engine().speed, forward);
    
    
  }

  async setSpeed() {
    await this.ble.setSpeed128(this.engine().address, this.engine().speed, this.engine().isForwards);
    console.log("setSpeed", this.engine().speed, this.engine().isForwards);
  }

}