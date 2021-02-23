import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { QuestionareModule } from '../../@core/shared/questionare/questionare.module';
import { createTranslateLoader } from '../../@theme/theme.module';
import { OnbordingRoutingModule } from './onbording-routing.module';
import { OnbordingComponent } from './onbording.component';

@NgModule({
  declarations: [OnbordingComponent],
  imports: [
    CommonModule,
    OnbordingRoutingModule,
    NbCardModule,
    QuestionareModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
})
export class OnbordingModule {}
