import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentalRoutingModule } from './experimental-routing.module';
import { NewCourseComponent } from './new-course/new-course.component';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
} from '@nebular/theme';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [NewCourseComponent],
  imports: [
    CommonModule,
    ExperimentalRoutingModule,
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    MatInputModule,
    NbCardModule,
    NbIconModule,
  ],
})
export class ExperimentalModule {}
