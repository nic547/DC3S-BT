import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BLESetupComponent } from './ble-setup/ble-setup.component';
import BLEServiceToken, { IBLEService } from './services/ble-service/ble.interface';
import { inject } from '@angular/core';

import { BLEServiceFactory } from './services/ble-service/ble.service.factory';
import { EngineRootComponent } from './engine/engine-root.component';
import { DataService } from './services/data-service/data.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BLESetupComponent, EngineRootComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{provide: BLEServiceToken, useFactory: BLEServiceFactory.create}]
})
export class AppComponent implements OnInit{
  title = 'web';

  ngOnInit(): void {
    this.dataService.setup();
  }

  protected bleService = inject(BLEServiceToken);
  protected dataService = inject(DataService)
}
