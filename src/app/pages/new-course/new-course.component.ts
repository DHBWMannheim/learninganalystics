import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../@core/data/course.service';

@Component({
  selector: 'ngx-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss'],
})
export class NewCourseComponent implements OnInit {
  key = '';
  name = '';

  constructor(private readonly coursesService: CoursesService) {}

  ngOnInit(): void {}

  async joinCourse() {
    await this.coursesService.joinCourse(this.key);
    this.key = '';
    // TODO:
  }

  async createCourse() {
    await this.coursesService.createCourse(this.name);
    this.name = '';
    //TODO:
  }
  //TODO: Redirect to course
}
