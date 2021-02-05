import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';

@NgModule({
  imports: [CommonModule, NbCardModule, ThemeModule, FeedbackRoutingModule],
  declarations: [FeedbackComponent],
})
export class FeedbackModule {}
