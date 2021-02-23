import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
} from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ButtonGroupControlModule } from '../../@theme/button-group-control/button-group-control.module';
import { createTranslateLoader } from '../../@theme/theme.module';
import { OnbordingRoutingModule } from './onbording-routing.module';
import { OnbordingComponent } from './onbording.component';

@NgModule({
  declarations: [OnbordingComponent],
  imports: [
    CommonModule,
    OnbordingRoutingModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonGroupModule,
    NbCardModule,
    ButtonGroupControlModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
})
export class OnbordingModule {}
