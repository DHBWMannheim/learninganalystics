import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonGroupModule,
  NbButtonModule,
  NbTooltipModule,
} from '@nebular/theme';
import { ButtonGroupControlComponent } from './button-group-control.component';

@NgModule({
  imports: [
    CommonModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonGroupModule,
    NbTooltipModule,
  ],
  declarations: [ButtonGroupControlComponent],
  exports: [ButtonGroupControlComponent],
})
export class ButtonGroupControlModule {}
