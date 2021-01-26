import { Component, OnInit } from '@angular/core';
import { NbSearchService } from '@nebular/theme';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;

  constructor(private readonly search: NbSearchService) {}
  ngOnInit(): void {
    this.search.onSearchSubmit().subscribe(({ term }) => {
      console.log('TODO: SEARCH:', term);
    });
  }
}
