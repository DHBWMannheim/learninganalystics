import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../@core/data/course.service';
import { Feedback, FeedbackService } from '../../@core/data/feedback.service';
import { UserService } from '../../@core/data/user.service';

@Component({
  selector: 'ngx-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  isLecturer: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async ({ courseId }) => {
      this.isLecturer = await this.coursesService.isLecturer(courseId);
    });

    // this.translate.onLangChange.subscribe(async () => { //TODO:
    //   this.lecturerChart = await this.generateChart();
    // });
  }
}
