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
    tooltip: {
      position: 'top',
      appendToBody: true,
    },
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
      appendToBody: true,
      trigger: 'axis',
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
      interval: 1,
    },
    series: [],
  };

  feedbackChart = {
    tooltip: {
      position: 'top',
      appendToBody: true,
      trigger: 'axis',
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
      interval: 1,
    },
    series: [],
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

    this.comments = feedback.map((f) => f.comment);

    const funGroup = groupBy(
      feedback.map(({ fun }) => fun),
      Number,
    );

    const informationsGroup = groupBy(
      feedback.map(({ informations }) => informations),
      Number,
    );

    const qualityGroup = groupBy(
      feedback.map(({ quality }) => quality),
      Number,
    );

    const transferGroup = groupBy(
      feedback.map(({ transfer }) => transfer),
      Number,
    );

    //TODO: Export
    this.feedbackChart.series = [
      {
        data: [
          funGroup[0]?.length || 0,
          informationsGroup[0]?.length || 0,
          qualityGroup[0]?.length || 0,
          transferGroup[0]?.length || 0,
        ],
        type: 'bar',
        name: 'Gering', //TODO: Translation
        barGap: 0,
        showBackground: true,
      },
      {
        data: [
          funGroup[1]?.length || 0,
          informationsGroup[1]?.length || 0,
          qualityGroup[1]?.length || 0,
          transferGroup[1]?.length || 0,
        ],
        type: 'bar',
        name: 'Mittel',
        barGap: 0,
        showBackground: true,
      },
      {
        data: [
          funGroup[2]?.length || 0,
          informationsGroup[2]?.length || 0,
          qualityGroup[2]?.length || 0,
          transferGroup[2]?.length || 0,
        ],
        type: 'bar',
        name: 'Hoch',
        barGap: 0,
        showBackground: true,
      },
    ];

    this.feedbackChart = { ...this.feedbackChart };
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
    //TODO: funktioniert das, wenn kein Questionare gibt
    const onlineGroup = groupBy(
      questionares.map(({ online }) => online),
      Number,
    );

    const appsGroup = groupBy(
      questionares.map(({ apps }) => apps),
      Number,
    );

    const experienceGroup = groupBy(
      questionares.map(({ experience }) => experience),
      Number,
    );

    this.questionareChart.series = [
      {
        data: [
          onlineGroup[0]?.length || 0,
          appsGroup[0]?.length || 0,
          experienceGroup[0]?.length || 0,
        ],
        type: 'bar',
        name: 'Gering', //TODO: Translation
        barGap: 0,
        showBackground: true,
      },
      {
        data: [
          onlineGroup[1]?.length || 0,
          appsGroup[1]?.length || 0,
          experienceGroup[1]?.length || 0,
        ],
        type: 'bar',
        name: 'Mittel',
        barGap: 0,
        showBackground: true,
      },
      {
        data: [
          onlineGroup[2]?.length || 0,
          appsGroup[2]?.length || 0,
          experienceGroup[2]?.length || 0,
        ],
        type: 'bar',
        name: 'Hoch',
        barGap: 0,
        showBackground: true,
      },
    ];
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
