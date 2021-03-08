import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { groupBy } from 'lodash';
import { filter, take } from 'rxjs/operators';
import { Course, CoursesService } from '../../../@core/data/course.service';
import {
  Feedback,
  FeedbackService,
} from '../../../@core/data/feedback.service';
import {
  Questionare,
  QuestionareService,
} from '../../../@core/data/questionare.service';
import { createCsv, Csv } from './csv.helper';

const splitLine = {
  show: true,
  lineStyle: {
    color: '#8f9bb3',
    width: 1,
    type: 'solid',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10,
  },
};

@Component({
  selector: 'ngx-lecturer',
  templateUrl: './lecturer.component.html',
  styleUrls: ['./lecturer.component.scss'],
})
export class LecturerComponent implements OnInit {
  typeChart = {
    radar: [
      {
        top: 30,
        indicator: [
          { text: '', max: 1 },
          { text: '', max: 1 },
          { text: '', max: 1 },
          { text: '', max: 1 },
        ],
        center: ['50%', '50%'],
        splitLine,
      },
    ],
    series: [
      {
        name: 'Lerntyp',
        type: 'radar',
        areaStyle: {},
        data: [],
      },
    ],
  };

  questionareChart = {
    tooltip: {
      position: 'top',
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: [],
      splitLine,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
      },
    ],
  };

  feedbackChart = {
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
      splitLine,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
      },
    ],
  };

  comments: string[];

  private rawFeedbackData: Feedback[];
  private rawQuenstionareData: Questionare[];

  constructor(
    private readonly courseService: CoursesService,
    private readonly questionareService: QuestionareService,
    private readonly route: ActivatedRoute,
    private readonly feedbackService: FeedbackService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async ({ courseId }) => {
      await this.loadCourse(courseId);

      this.translate.onLangChange.subscribe(() =>
        this.updateChartTranslations(),
      );
    });
    this.updateChartTranslations();
  }

  private async updateChartTranslations() {
    this.translate
      .get('feedback.lecturerView.feedback.chart')
      .toPromise()
      .then((v) => {
        this.feedbackChart.xAxis.data = v;
        this.feedbackChart = { ...this.feedbackChart };
      });

    this.translate
      .get('feedback.lecturerView.participants.questionareChart')
      .toPromise()
      .then((v) => {
        this.questionareChart.xAxis.data = v;
        this.questionareChart = { ...this.questionareChart };
      });

    this.translate
      .get('feedback.lecturerView.participants.typeChart')
      .toPromise()
      .then((v) => {
        this.typeChart.radar[0].indicator.forEach((i, index) => {
          i.text = v[index];
        });
      });
  }

  private async loadCourse(courseId: string) {
    const {
      creations,
      participations,
    } = await this.courseService.currentCourses.pipe(take(1)).toPromise();
    const course =
      creations
        .concat(participations)
        .find((course) => course.id === courseId) ||
      (await this.courseService.get(courseId));

    await Promise.all([
      this.loadFeedback(course),
      this.loadQuestionares(course),
    ]);
  }

  private async loadFeedback(course: Course) {
    const feedback: Feedback[] = await this.feedbackService.getData(
      await this.feedbackService
        .getCollection()
        .where('course', '==', this.courseService.createRef(course.id))
        .get(),
    );
    this.rawFeedbackData = feedback;
    if (feedback.length) {
      this.comments = feedback.map((f) => f.comment);

      this.feedbackChart.series[0].data = [
        feedback.reduce((acc, f) => f.fun + acc, 0) / feedback.length,
        feedback.reduce((acc, f) => f.informations + acc, 0) / feedback.length,
        feedback.reduce((acc, f) => f.quality + acc, 0) / feedback.length,
        feedback.reduce((acc, f) => f.transfer + acc, 0) / feedback.length,
      ];
      this.feedbackChart = { ...this.feedbackChart };
    }
  }

  private async loadQuestionares(course: Course) {
    const participants = course.participants;
    const questionares = await this.questionareService.getChunked(
      participants,
      (chunk) =>
        this.questionareService
          .getCollection()
          .where('user', 'in', chunk)
          .get(),
      (snap) => this.questionareService.getData(snap),
    );

    this.rawQuenstionareData = questionares;

    const typeData = Object.entries(groupBy(questionares, (q) => q.typ)).reduce(
      (acc, [key, value]) => {
        acc[key] = value.length;
        return acc;
      },
      new Array(4).fill(0),
    );

    this.typeChart.radar[0].indicator.forEach((i) => {
      i.max = Math.max(participants.length, 1);
    });

    this.typeChart.series[0].data = [
      {
        value: typeData,
      },
    ];

    this.typeChart = { ...this.typeChart };

    const questionareData = [
      questionares.reduce((acc, f) => f.online + acc, 0) / participants.length,
      questionares.reduce((acc, f) => f.apps + acc, 0) / participants.length,
      questionares.reduce((acc, f) => f.experience + acc, 0) /
        participants.length,
    ];

    this.questionareChart.series[0] = {
      data: questionareData,
      type: 'bar',
      showBackground: true,
    };
    this.questionareChart = { ...this.questionareChart };
  }

  async exportComments() {
    const translation = await this.translate
      .get('feedback.lecturerView.comments.label')
      .toPromise();
    const data = [[translation], ...this.comments.map((comment) => [comment])];
    this.downloadCsv(data);
  }

  async exportCourseFeedback() {
    const data = [
      await this.translate
        .get('feedback.lecturerView.feedback.chart')
        .toPromise(),
      ...this.rawFeedbackData.map(
        ({ fun, informations, quality, transfer }) => [
          `${fun}`,
          `${informations}`,
          `${quality}`,
          `${transfer}`,
        ],
      ),
    ];
    this.downloadCsv(data);
  }

  async exportParticipants() {
    const learningTypeNames = await this.translate
      .get('feedback.lecturerView.participants.typeChart')
      .toPromise();
    const data = [
      await Promise.all([
        this.translate.get('questionare.typ.label').toPromise(),
        this.translate.get('questionare.online.label').toPromise(),
        this.translate.get('questionare.apps.label').toPromise(),
        this.translate.get('questionare.experience.label').toPromise(),
      ]),
      ...this.rawQuenstionareData.map(({ typ, online, apps, experience }) => [
        `${learningTypeNames[typ]}`,
        `${online}`,
        `${apps}`,
        `${experience}`,
      ]),
    ];

    this.downloadCsv(data);
  }

  private downloadCsv(data: Csv) {
    const csv = new Blob([createCsv(data)], { type: 'text/csv' });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(csv));
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
