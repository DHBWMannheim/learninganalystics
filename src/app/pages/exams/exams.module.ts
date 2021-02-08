import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbIconModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ExamsRoutingModule } from './exams-routing.module';
import { ExamsComponent } from './exams.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    ExamsRoutingModule,
    NbIconModule,
    NbCalendarModule,
    NbButtonModule,
  ],
  declarations: [ExamsComponent],
})
export class ExamsModule {}
