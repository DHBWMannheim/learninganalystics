import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    FeedbackRoutingModule,
    NbIconModule,
    MatInputModule,
    MatRadioModule,
  ],
  declarations: [FeedbackComponent],
})
export class FeedbackModule {}
