import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../@core/data/course.service';

@Component({
  selector: 'ngx-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  isLecturer: boolean = false;

  courseLoaded = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async ({ courseId }) => {
      this.isLecturer = await this.coursesService.isLecturer(courseId);
      this.courseLoaded = true;
    });
  }
}
