import { NgModule } from '@angular/core';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { TermsComponent } from './terms/terms.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    FormsModule,
    NbAlertModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbSpinnerModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    TermsComponent,
  ],
})
export class AuthModule {}
