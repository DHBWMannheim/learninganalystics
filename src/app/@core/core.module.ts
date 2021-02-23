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
import { QuestionareComponent } from './shared/questionare/questionare.component';

export const NB_CORE_PROVIDERS = [
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService },
  ...NbAuthModule.forRoot({
    strategies: [
      NbFirebasePasswordStrategy.setup({
        name: 'password',
        register: {
          redirect: {
            success: '/auth/onboarding',
            failure: null
          },
        },
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
          maxLength: 50, // Das muss auch in der Sprachdatei angepasst werden
        },
        email: {
          required: true,
        },
      },
    },
  }).providers,
  LayoutService,
  SeoService,
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule, NbFirebaseAuthModule]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
