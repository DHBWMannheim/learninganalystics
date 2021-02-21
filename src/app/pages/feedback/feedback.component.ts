import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../@core/data/course.service';
import { Feedback, FeedbackService } from '../../@core/data/feedback.service';
import { UserService } from '../../@core/data/user.service';

const AXIS_NAMES = {
  en: [
    'Enjoyement',
    'Amount of Information',
    'Informations understandable',
    'Informationtransfer',
  ],
  de: [
    'Spaß',
    'Informationsversorgung',
    'Verständlichkeit',
    'Neue Informationen',
  ],
};

@Component({
  selector: 'ngx-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  isLecturer: boolean = false;
  loading = true;
  private courseId: string;

  lecturerChart = {
    title: {
      top: 30,
      left: 'center',
    },
    tooltip: {
      position: 'top',
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [0, 0, 0, 0],
        type: 'bar',
        showBackground: true,
      },
    ],
  };

  model = {
    id: null,
    comment: '',
    fun: 0,
    informations: 0,
    quality: 0,
    transfer: 0,
  };

  comments: string[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
    private readonly feedbackService: FeedbackService,
    private readonly toast: NbToastrService,
    private readonly userService: UserService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      this.isLecturer = await this.coursesService.isLecturer(courseId);

      if (this.isLecturer) {
        const feedback: Feedback[] = await this.feedbackService.getData(
          await this.feedbackService
            .getCollection()
            .where('course', '==', this.coursesService.createRef(this.courseId))
            .get(),
        );
        this.comments = feedback.map((f) => f.comment);
        this.lecturerChart.series[0].data = [
          feedback.reduce((acc, f) => f.fun + acc, 0) / feedback.length,
          feedback.reduce((acc, f) => f.informations + acc, 0) /
            feedback.length,
          feedback.reduce((acc, f) => f.quality + acc, 0) / feedback.length,
          feedback.reduce((acc, f) => f.transfer + acc, 0) / feedback.length,
        ];

        this.loading = false;
        return;
      }
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
      this.loading = false;
    });

    this.translate.onLangChange.subscribe(({ lang }) => {
      this.lecturerChart.xAxis.data = AXIS_NAMES[lang];
      this.lecturerChart = {...this.lecturerChart}
    });
    this.lecturerChart.xAxis.data = AXIS_NAMES[this.translate.currentLang];
  }

  async save() {
    await this.feedbackService.upsert({
      course: this.coursesService.createRef(this.courseId),
      user: this.userService.createRef((await this.userService.currentUser).id),
      ...this.model,
    });
    this.toast.success(
      await this.translate.get('feedback.toast.saved.message'),
      await this.translate.get('feedback.toast.saved.title'),
    );
  }
}
