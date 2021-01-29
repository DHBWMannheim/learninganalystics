import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getDeepFromObject,
  NbAuthService,
  NB_AUTH_OPTIONS,
} from '@nebular/auth';

const routes = [
  {
    action: 'resetPassword',
    redirectTo: '/auth/reset-password',
  },
];

@Component({
  selector: 'ngx-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  redirectDelay: number = 0;

  state: 'working' | 'failed' = 'working';

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.redirectDelay = getDeepFromObject(
      this.options,
      'forms.action.redirectDelay',
      null,
    );
  }

  ngOnInit(): void {
    this.redirect();
  }

  redirect(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const result = routes.find(({ action }) => action === params.mode);
      if (result) {
        setTimeout(() => {
          return this.router.navigate([result.redirectTo], {
            queryParams: params,
          });
        }, this.redirectDelay);
      } else {
        this.state = 'failed';
      }
    });
  }
}
