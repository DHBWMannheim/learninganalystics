import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss'],
})
export class NewCourseComponent implements OnInit {
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
