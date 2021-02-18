import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

import { createTranslateLoader, ThemeModule } from '../../@theme/theme.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

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
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [FeedbackComponent],
})
export class FeedbackModule {}
