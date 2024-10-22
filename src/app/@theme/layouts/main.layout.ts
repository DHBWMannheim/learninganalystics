import { Component } from '@angular/core';

@Component({
  selector: 'main-layout',
  styleUrls: ['./main.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
      <img src="https://upload.wikimedia.org/wikipedia/de/1/1d/DHBW-Logo.svg" alt="DHBW Logo" height="40em"> 
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class MainLayoutComponent {}
