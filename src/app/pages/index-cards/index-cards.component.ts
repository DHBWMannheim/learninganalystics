import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-index-cards',
  templateUrl: './index-cards.component.html',
  styleUrls: ['./index-cards.component.scss'],
})
export class IndexCardsComponent implements OnInit {
  cards = [];

  constructor() {}

  ngOnInit(): void {
    for (
      let i = 0;
      i < 10;
      i++ //TODO: Max 20, 10 ist optimum
    )
      this.cards.push({
        title: 'Demo',
        description: 'Descript',
      });
  }

  logChoice(event: any) {
    console.log(event);
  }
}
