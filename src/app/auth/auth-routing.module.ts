import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TermsComponent } from './terms/terms.component';
import { LogoutComponent } from './logout/logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ActionComponent } from './action/action.component';

const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent, // TODO: ? überschreiben
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'terms',
        component: TermsComponent,
      },
      {
        path: 'action',
        component: ActionComponent,
      },
      {
        path: '',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
