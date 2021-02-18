import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CoursesService } from '../../@core/data/course.service';
import { FeedbackService } from '../../@core/data/feedback.service';
import { UserService } from '../../@core/data/user.service';

@Component({
  selector: 'ngx-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  isLecturer: boolean;
  private courseId: string;

  model = {
    id: null,
    comment: '',
    fun: 0,
    informations: 0,
    quality: 0,
    transfer: 0,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
    private readonly feedbackService: FeedbackService,
    private readonly toast: NbToastrService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      this.isLecturer = await this.coursesService.isLecturer(courseId);

      const feedback = await this.feedbackService
        .getCollection()
        .where('course', '==', this.coursesService.createRef(this.courseId))
        .where(
          'user',
          '==',
          this.userService.createRef((await this.userService.currentUser).id),
        )
        .get();
      if (!feedback.empty) {
        const {
          comment,
          fun,
          informations,
          quality,
          transfer,
          id,
        } = await feedback.docs[0].data();
        this.model = {
          id,
          comment,
          fun,
          informations,
          quality,
          transfer,
        };
      }
    });
  }

  async save() {
    await this.feedbackService.upsert({
      course: this.coursesService.createRef(this.courseId),
      user: this.userService.createRef((await this.userService.currentUser).id),
      ...this.model,
    });
    this.toast.success('Success', 'Your feedback was saved');
  }
}
