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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ResizableModule } from 'angular-resizable-element';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';PlotlyModule.plotlyjs = PlotlyJS;
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { GraphiqueComponent } from './graphique/graphique.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [FranceComponent, MapComponent, GraphiqueComponent],
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
    FormsModule,
    MatDividerModule,
    MatSidenavModule,
    ResizableModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ],
  providers: [
    MatDatepickerModule
  ]
})
export class FranceModule { }
