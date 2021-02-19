import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ThemeModule } from '../../@theme/theme.module';
import { createTranslateLoader } from '../../app.module';
import { NewCourseRoutingModule } from './new-course-routing.module';
import { NewCourseComponent } from './new-course.component';

@NgModule({
  declarations: [NewCourseComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSpinnerModule,
    ThemeModule,
    NewCourseRoutingModule,
    FormsModule,
    NbButtonModule,
    NbInputModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
    }
    }),
  ],
})
export class NewCourseModule {}
