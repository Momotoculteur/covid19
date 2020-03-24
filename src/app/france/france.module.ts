import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FranceRoutingModule } from './france-routing.module';
import { FranceComponent } from '../france/france.component';


@NgModule({
  declarations: [FranceComponent],
  imports: [
    CommonModule,
    FranceRoutingModule
  ]
})
export class FranceModule { }
