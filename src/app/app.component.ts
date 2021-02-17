import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(
    private readonly swUpdate: SwUpdate,
    private readonly translateService: TranslateService,
  ) {
    const browserLang = translateService.getBrowserLang();
    translateService.addLangs(['en', 'de']);
    translateService.setDefaultLang('de');
    // translateService.use(browserLang.match(/en|de/) ? browserLang : 'de');
  }

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
