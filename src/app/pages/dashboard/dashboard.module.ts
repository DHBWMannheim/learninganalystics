import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { CalendarModule } from 'angular-calendar';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [CommonModule, NbCardModule, ThemeModule, DashboardRoutingModule, CalendarModule],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
