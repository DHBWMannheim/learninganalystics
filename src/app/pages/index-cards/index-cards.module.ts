import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbActionsModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { IndexCardsRoutingModule } from './index-cards-routing.module';
import { IndexCardsComponent } from './index-cards.component';
import { TinderUIComponent } from './tinder-ui/tinder-ui.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    IndexCardsRoutingModule,
    NbIconModule,
    NbActionsModule,
    NgxEchartsModule.forChild(),
  ],
  declarations: [IndexCardsComponent, TinderUIComponent],
})
export class IndexCardsModule {}
