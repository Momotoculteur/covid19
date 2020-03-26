import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { FloatingButtonActionComponent } from './floating-button-action/floating-button-action.component';
import { FloatingButtonTriggerComponent } from './floating-button-trigger/floating-button-trigger.component';




@NgModule({
  declarations: [
    FloatingButtonComponent,
    FloatingButtonActionComponent,
    FloatingButtonTriggerComponent
  ],
  exports: [
    FloatingButtonComponent,
    FloatingButtonActionComponent,
    FloatingButtonTriggerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FloatingButtonModule { }
