import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  NbAlertModule,
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbTimepickerModule,
} from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ExamService } from '../../@core/data/exams.service';
import { DatePipe } from '@angular/common';

import { ThemeModule } from '../../@theme/theme.module';
import { createTranslateLoader } from '../../app.module';
import { ExamsRoutingModule } from './exams-routing.module';
import { ExamsComponent } from './exams.component';
import { DeleteComponent } from './delete/delete.component';
import { AddComponent } from './add/add.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    ReactiveFormsModule,
    ExamsRoutingModule,
    NbIconModule,
    NbCalendarModule,
    NbButtonModule,
    NbSpinnerModule,
    NbInputModule,
    MatInputModule,
    MatFormFieldModule,
    NbDatepickerModule,
    NbTimepickerModule,
    FormsModule,
    NbAlertModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
    }
    }),
  ],
  declarations: [
    ExamsComponent,
    DeleteComponent,
    AddComponent,
    EditComponent
  ],
  providers: [ExamService, DatePipe],
})
export class ExamsModule {}
