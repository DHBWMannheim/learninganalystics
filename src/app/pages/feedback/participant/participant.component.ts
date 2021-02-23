import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import { FeedbackService } from '../../../@core/data/feedback.service';
import { UserService } from '../../../@core/data/user.service';

@Component({
  selector: 'ngx-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss'],
})
export class ParticipantComponent implements OnInit {
  private courseId: string;

  form = new FormGroup({
    informations: new FormControl(null, [Validators.required]),
    transfer: new FormControl(null, [Validators.required]),
    quality: new FormControl(null, [Validators.required]),
    fun: new FormControl(null, [Validators.required]),
    comment: new FormControl(null),
  });

  private currentFeedbackId: string;

  constructor(
    private readonly userService: UserService,
    private readonly feedbackService: FeedbackService,
    private readonly coursesService: CoursesService,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly toastr: NbToastrService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(({ courseId }) => {
      this.courseId = courseId;
      this.load(courseId);
    });
  }

  private async load(courseId: string) {
    const feedback = await this.feedbackService
      .getCollection()
      .where('course', '==', this.coursesService.createRef(courseId))
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

      this.currentFeedbackId = id;

      this.form.get('comment').setValue(comment);
      this.form.get('fun').setValue(fun);
      this.form.get('informations').setValue(informations);
      this.form.get('quality').setValue(quality);
      this.form.get('transfer').setValue(transfer);
    }
  }

  async save() {
    await this.feedbackService.upsert({
      course: this.coursesService.createRef(this.courseId),
      user: this.userService.createRef((await this.userService.currentUser).id),
      id: this.currentFeedbackId,
      comment: this.form.get('comment').value,
      fun: this.form.get('fun').value,
      informations: this.form.get('informations').value,
      quality: this.form.get('quality').value,
      transfer: this.form.get('transfer').value,
    });
    this.toastr.success(
      await this.translate.get('feedback.toast.saved.message').toPromise(),
      await this.translate.get('feedback.toast.saved.title').toPromise(),
    );
  }
}
