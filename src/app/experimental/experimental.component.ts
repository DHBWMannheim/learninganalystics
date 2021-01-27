import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-experimental',
  templateUrl: './experimental.component.html',
  styleUrls: ['./experimental.component.scss']
})
export class ExperimentalComponent implements OnInit {

  courses = [];

  constructor() {}

  ngOnInit(): void {
    for (let i = 1; i <= 10; i++) {
      this.courses.push({
        name: 'Course ' + i,
        description: 'Random Text, but not too ranom :)',
      });
    }
  }

}
