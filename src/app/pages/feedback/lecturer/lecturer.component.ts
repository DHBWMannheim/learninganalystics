import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { Course, CoursesService } from '../../../@core/data/course.service';
import { QuestionareService } from '../../../@core/data/questionare.service';

@Component({
  selector: 'ngx-lecturer',
  templateUrl: './lecturer.component.html',
  styleUrls: ['./lecturer.component.scss'],
})
export class LecturerComponent implements OnInit {
  constructor(
    private readonly courseService: CoursesService,
    private readonly questionareService: QuestionareService,
    private readonly route: ActivatedRoute,
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

  private async loadFeedback(course: Course) {}

  private async loadQuestionares(course: Course) {
    const participants = course.participants;
    const questionares = this.questionareService.getChunked(
      participants,
      (chunk) =>
        this.questionareService
          .getCollection()
          .where('user', 'in', chunk)
          .get(),
      (snap) => this.questionareService.getData(snap),
    );
    console.log(questionares)
  }
}
