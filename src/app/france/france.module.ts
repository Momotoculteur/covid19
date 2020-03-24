import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FranceRoutingModule } from './france-routing.module';
import { FranceComponent } from '../france/france.component';
import {MatTabsModule} from '@angular/material/tabs';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { MapComponent } from './map/map.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [FranceComponent, MapComponent],
  imports: [
    CommonModule,
    FranceRoutingModule,
    PlotlyModule,
    MatTabsModule
  ]
})
export class FranceModule { }
