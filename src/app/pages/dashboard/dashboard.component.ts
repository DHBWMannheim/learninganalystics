import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  a: {};
  a2: {};

  constructor(readonly auth: NbAuthService, public auth2: AngularFireAuth) {
    this.auth.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.a = token.getPayload();
    });

    this.auth2.user.subscribe((u) => (this.a2 = u));
  }
}
