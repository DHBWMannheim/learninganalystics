import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule } from '@nebular/theme';

import { createTranslateLoader, ThemeModule } from '../../@theme/theme.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { LecturerComponent } from './lecturer/lecturer.component';
import { ParticipantComponent } from './participant/participant.component';

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
    NbListModule,
    NgxEchartsModule.forChild(),
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
