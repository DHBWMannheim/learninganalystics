import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { NbAuthModule } from '@nebular/auth';
import {
  NbFirebaseAuthModule,
  NbFirebasePasswordStrategy,
} from '@nebular/firebase-auth';

import { LayoutService } from './utils/layout.service';
import { RippleService } from './utils/ripple.service';
import { SeoService } from './utils/seo.service';

export const NB_CORE_PROVIDERS = [
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService },
  ...NbAuthModule.forRoot({
    strategies: [
      NbFirebasePasswordStrategy.setup({
        name: 'password',
      }),
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
  LayoutService, // TODO: ? brauchen wir das?
  SeoService, // TODO: ? brauchen wir das?
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule, NbFirebaseAuthModule],
  declarations: [],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
