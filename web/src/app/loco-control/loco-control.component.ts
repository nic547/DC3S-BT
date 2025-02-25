import { Component, inject, OnInit } from '@angular/core';
import { BLEService } from '../ble.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-loco-control',
  imports: [FormsModule, NgFor],
  templateUrl: './loco-control.component.html',
  styleUrl: './loco-control.component.css'
})
export class LocoControlComponent implements OnInit {

  private ble = inject(BLEService);

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