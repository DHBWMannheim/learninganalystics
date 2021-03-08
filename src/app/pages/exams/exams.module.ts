import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbIconModule,
} from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ExamsService } from '../../@core/data/exams.service';
import { DatePipe } from '@angular/common';

import { ThemeModule } from '../../@theme/theme.module';
import { createTranslateLoader } from '../../app.module';
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
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
    }
    }),
  ],
  declarations: [ExamsComponent],
  providers: [ExamsService, DatePipe],
})
export class ExamsModule {}
