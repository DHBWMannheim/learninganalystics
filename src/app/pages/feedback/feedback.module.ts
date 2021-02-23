import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbListModule,
} from '@nebular/theme';

import { createTranslateLoader, ThemeModule } from '../../@theme/theme.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { LecturerComponent } from './lecturer/lecturer.component';
import { ParticipantComponent } from './participant/participant.component';
import { ButtonGroupControlModule } from '../../@theme/button-group-control/button-group-control.module';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    FeedbackRoutingModule,
    NbIconModule,
    MatInputModule,
    MatRadioModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbListModule,
    NgxEchartsModule.forChild(),
    ButtonGroupControlModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [FeedbackComponent, LecturerComponent, ParticipantComponent],
})
export class FeedbackModule {}
