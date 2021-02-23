import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnbordingRoutingModule } from './onbording-routing.module';
import { NbButtonGroupModule, NbButtonModule, NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnbordingComponent } from './onbording.component';
import { ButtonGroupControlComponent } from './button-group-control/button-group-control.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../../@theme/theme.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [OnbordingComponent, ButtonGroupControlComponent],
  imports: [
    CommonModule,
    OnbordingRoutingModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonGroupModule,
    NbCardModule,
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
