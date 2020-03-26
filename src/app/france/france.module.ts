import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FranceRoutingModule } from './france-routing.module';
import { FranceComponent } from '../france/france.component';
import {MatTabsModule} from '@angular/material/tabs';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { MapComponent } from './map/map.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FloatingButtonModule } from '../shared/module/floating-button/floating-button.module';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [FranceComponent, MapComponent],
  imports: [
    CommonModule,
    FranceRoutingModule,
    PlotlyModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    FloatingButtonModule,
    MatRadioModule,
    FormsModule
  ]
})
export class FranceModule { }
