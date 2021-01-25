import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-index-cards',
  templateUrl: './index-cards.component.html',
  styleUrls: ['./index-cards.component.scss']
})
export class IndexCardsComponent implements OnInit {

  cards = [
    {
      img: "https://placeimg.com/300/300/people",
      title: "Demo card 1",
      description: "This is a demo for Tinder like swipe cards"
    },
    {
      img: "https://placeimg.com/300/300/animals",
      title: "Demo card 2",
      description: "This is a demo for Tinder like swipe cards"
    },
    {
      img: "https://placeimg.com/300/300/nature",
      title: "Demo card 3",
      description: "This is a demo for Tinder like swipe cards"
    },
    {
      img: "https://placeimg.com/300/300/tech",
      title: "Demo card 4",
      description: "This is a demo for Tinder like swipe cards"
    },
    {
      img: "https://placeimg.com/300/300/arch",
      title: "Demo card 5",
      description: "This is a demo for Tinder like swipe cards"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  logChoice(event: any){
    console.log(event)
  }

}
