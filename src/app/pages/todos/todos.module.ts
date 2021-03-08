import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbMenuModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { createTranslateLoader } from '../../app.module';
import { AddComponent } from './add/add.component';
import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
    }
    }),
  ],
  declarations: [TodosComponent, AddComponent],
})
export class TodosModule {}
