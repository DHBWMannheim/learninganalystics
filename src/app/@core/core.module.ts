import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { NbAuthModule } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { LayoutService, SeoService, StateService } from './utils';

import { RippleService } from './utils/ripple.service';
import {
  NbFirebasePasswordStrategy,
  NbFirebaseAuthModule,
} from '@nebular/firebase-auth';

const DATA_SERVICES = [
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({
    strategies: [
      NbFirebasePasswordStrategy.setup({
        name: 'password',
      }),
      // NbFirebaseGoogleStrategy.setup({
      //   name: 'google',
      // }),  TODO: ? oder sagen wir, damit wäre eine nachverfolgung möglich
    ],
    forms: {
      login: {
        strategy: 'password',
      },
      register: {
        strategy: 'password',
      },
      requestPassword: {
        strategy: 'password',
      },
      resetPassword: {
        strategy: 'password',
      },
      logout: {
        strategy: 'password',
      },
      action: {
        redirectDelay: 2000,
      },
      validation: {
        password: {
          required: true,
          minLength: 6,
          maxLength: 50,
        },
        email: {
          required: true,
        },
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    // TODO: ? brauchen wir das?
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    // TODO: ? brauchen wir das?
    provide: NbRoleProvider,
    useClass: NbSimpleRoleProvider,
  },
  LayoutService, // TODO: ? brauchen wir das?
  SeoService, // TODO: ? brauchen wir das?
  StateService, // TODO: ? brauchen wir das?
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule, NbFirebaseAuthModule],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
