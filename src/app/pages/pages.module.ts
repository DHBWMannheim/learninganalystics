import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
