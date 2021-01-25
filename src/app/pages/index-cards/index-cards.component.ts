import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-index-cards',
  templateUrl: './index-cards.component.html',
  styleUrls: ['./index-cards.component.scss'],
})
export class IndexCardsComponent implements OnInit {
  cards = [
    {
      title: 'Demo card 1',
      description: 'This is a demo for Tinder like swipe cards',
    },
    {
      title: 'Demo card 2',
      description: 'This is a demo for Tinder like swipe cards',
    },
    {
      title: 'Demo card 3',
      description: 'This is a demo for Tinder like swipe cards',
    },
    {
      title: 'Demo card 4',
      description: 'This is a demo for Tinder like swipe cards',
    },
    {
      title: 'Demo card 5',
      description: 'This is a demo for Tinder like swipe cards',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  logChoice(event: any) {
    console.log(event);
  }
}
