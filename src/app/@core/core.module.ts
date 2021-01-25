import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  LayoutService,
  SeoService,
  StateService,
} from './utils';
import { UserData } from './data/users';

import { UserService } from './mock/users.service';
import { RippleService } from './utils/ripple.service';
import { MockDataModule } from './mock/mock-data.module';
import { NbFirebasePasswordStrategy, NbFirebaseGoogleStrategy, NbFirebaseAuthModule} from '@nebular/firebase-auth';


const socialLinks = [
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'google',
  },
];

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
  {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService},
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
        delay: 3000,
      }),
      NbFirebasePasswordStrategy.setup({
        name: 'password',
      }),
      NbFirebaseGoogleStrategy.setup({
        name: 'google'
      })
    ],
    forms: {
      login: {
        // socialLinks: socialLinks,  TODO: Google?   TODO: Fix: Terms & Condition
        strategy: 'password'
      },
      register: {
        // socialLinks: socialLinks,
        strategy: 'password'
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
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
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  LayoutService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
    NbFirebaseAuthModule
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
