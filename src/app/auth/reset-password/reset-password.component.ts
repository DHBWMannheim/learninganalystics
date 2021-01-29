/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDeepFromObject, NbAuthResult, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';

@Component({
  selector: 'nb-reset-password-page',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    // TODO: Momentan verlink firebase immer auf password-reset. Eventuell zukünftig eine action-route haben, welche auf die passende Seite redirected!!!!




    this.redirectDelay = this.getConfigValue(
      'forms.resetPassword.redirectDelay',
    );
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy = this.getConfigValue('forms.resetPassword.strategy');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['oobCode'];//TODO: Temporär  + TODO: Action-Url in Firebase anpassen
      this.user.code = code;
    });
  }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service
      .resetPassword(this.strategy, this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
