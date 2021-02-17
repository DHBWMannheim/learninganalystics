import { CommonModule } from '@angular/common';
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

import { ThemeModule } from '../../@theme/theme.module';
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
  ],
})
export class NewCourseModule {}
