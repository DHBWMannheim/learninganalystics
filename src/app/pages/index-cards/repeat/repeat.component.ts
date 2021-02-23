import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {

  constructor() { }

  roundFinished: boolean = false;

  ngOnInit(): void {
  }

}
