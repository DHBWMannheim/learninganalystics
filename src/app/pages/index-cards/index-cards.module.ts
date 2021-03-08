import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbTabsetModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { IndexCardsRoutingModule } from './index-cards-routing.module';
import { IndexCardsComponent } from './index-cards.component';
import { TinderUIComponent } from './tinder-ui/tinder-ui.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DeleteComponent } from './delete/delete.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../../app.module';
import { RepeatComponent } from './repeat/repeat.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    IndexCardsRoutingModule,
    NbIconModule,
    NbActionsModule,
    NgxEchartsModule.forChild(),
    MatIconModule,
    MatButtonModule,
    NbButtonModule,
    NbInputModule,
    MatFormFieldModule,
    MatInputModule,
    NbSpinnerModule,
    MatCheckboxModule,
    NbCheckboxModule,
    FormsModule,
    NbAlertModule,
    NbTabsetModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
    }
    }),
  ],
  declarations: [
    IndexCardsComponent,
    TinderUIComponent,
    AddComponent,
    EditComponent,
    DeleteComponent,
    RepeatComponent,
  ],
})
export class IndexCardsModule {}
