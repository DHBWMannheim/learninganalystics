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
import { QuestionareService } from '../../../@core/data/questionare.service';

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
  typeChart;

  questionareChart;

  feedbackChart;

  comments: string[];

  constructor(
    private readonly courseService: CoursesService,
    private readonly questionareService: QuestionareService,
    private readonly route: ActivatedRoute,
    private readonly feedbackService: FeedbackService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ courseId }) => this.loadCourse(courseId)); //TODO: Das als input
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
    if (feedback.length) {
      this.comments = feedback.map((f) => f.comment);

      this.feedbackChart = {
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
          data: await this.translate.get('feedback.chart').toPromise(),
          splitLine,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [
              feedback.reduce((acc, f) => f.fun + acc, 0) / feedback.length,
              feedback.reduce((acc, f) => f.informations + acc, 0) /
                feedback.length,
              feedback.reduce((acc, f) => f.quality + acc, 0) / feedback.length,
              feedback.reduce((acc, f) => f.transfer + acc, 0) /
                feedback.length,
            ],
            type: 'bar',
            showBackground: true,
          },
        ],
      };
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

    const typeData = Object.entries(groupBy(questionares, (q) => q.typ)).reduce(
      (acc, [key, value]) => {
        acc[key] = value.length;
        return acc;
      },
      new Array(4).fill(0),
    );

    console.log(typeData);

    this.typeChart = {
      radar: [
        {
          top: 30,
          indicator: [
            { text: 'Visuell', max: participants.length }, // TODO: Translation
            { text: 'Auditiv', max: participants.length },
            { text: 'Motorisch', max: participants.length },
            { text: 'Kommunikativ', max: participants.length },
          ],
          center: ['50%', '53%'],
          splitLine,
        },
      ],
      series: [
        {
          name: 'Lerntyp',
          type: 'radar',
          areaStyle: {},
          data: [
            {
              value: typeData,
            },
          ],
        },
      ],
    };

    const questionareData = [
      questionares.reduce((acc, f) => f.online + acc, 0) / participants.length,
      questionares.reduce((acc, f) => f.apps + acc, 0) / participants.length,
      questionares.reduce((acc, f) => f.experience + acc, 0) /
        participants.length,
    ];

    this.questionareChart = {
      tooltip: {
        position: 'top',
      },
      legend: {
        show: false,
      },
      xAxis: {
        type: 'category',
        data: [
          'Affinity to online teaching',
          'Usage frequency of learning apps',
          'Experience with online teaching',
        ],
        splitLine,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: questionareData,
          type: 'bar',
          showBackground: true,
        },
      ],
    };
  }
}
