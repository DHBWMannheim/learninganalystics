import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(private swUpdate: SwUpdate) {}
  ngOninit() {
    this.swUpdate.available.subscribe((event) => {
      console.log(
        'A newer version is now available. Refresh the page now to update the cache',
      );
      location.reload();
    });
    this.swUpdate.checkForUpdate();
  }
}
