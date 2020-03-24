import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalRoutingModule } from './global-routing.module';
import { GlobalComponent } from '../global/global.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [GlobalComponent],
  imports: [
    CommonModule,
    GlobalRoutingModule,
    MatTabsModule
  ]
})
export class GlobalModule { }
