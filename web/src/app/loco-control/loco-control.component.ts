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
export class LocoControlComponent implements OnInit {

  private ble = inject(BLEServiceToken);

  public engine = input.required<Engine>();

  protected locoAddress = 3;
  protected speed = 0;
  protected forward = true;
  protected functions: dccFunction[] = [];

  public ngOnInit() {
    for (let i = 0; i <= 28; i++) {
      this.functions.push(new dccFunction(i, false));
    }
  }

  async toggleFunction(number: number) {
    await this.ble.setFunction(this.locoAddress, number, !this.functions[number].active);
    this.functions[number].active = !this.functions[number].active;
  }

  async setDirection(forward: boolean) {
    this.speed = 0;
    // Bit of a hack to get the slider to update
    (document.getElementById("speedSlider") as HTMLInputElement).value = "0";
    await ui();

    this.forward = forward;
    await this.ble.setSpeed128(this.locoAddress, this.speed, forward);
    console.log("setDirection",this.speed, this.forward);
    
    
  }

  async setSpeed() {
    await this.ble.setSpeed128(this.locoAddress, this.speed, this.forward);
    console.log("setSpeed", this.speed, this.forward);
  }

}

class dccFunction {
  readonly fnNumber: number;
  readonly displayName: string;
  active: boolean;

  constructor(fnNumber: number, active: boolean) {
    this.fnNumber = fnNumber;
    this.displayName = `F${fnNumber}`;
    this.active = active;
  }
}