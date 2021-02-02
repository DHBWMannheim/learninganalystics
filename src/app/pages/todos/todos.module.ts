import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbMenuModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos.component';
import { AddComponent } from './add/add.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NbMenuModule,
    NbCardModule,
    ThemeModule,
    NbListModule,
    TodosRoutingModule,
    MatIconModule,
    MatButtonModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    MatFormFieldModule,
    MatInputModule,
    NbSpinnerModule,
    MatCheckboxModule,
    NbCheckboxModule,
    MatDatepickerModule,
    NgxEchartsModule.forChild(),
  ],
  declarations: [TodosComponent, AddComponent],
})
export class TodosModule {}
