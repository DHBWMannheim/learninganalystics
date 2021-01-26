import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    ProfileRoutingModule,
    NbButtonModule,
  ],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
