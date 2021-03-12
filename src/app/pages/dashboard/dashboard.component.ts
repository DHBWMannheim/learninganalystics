import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { differenceInCalendarDays, isSameDay, isSameMonth } from 'date-fns';

import { Course, CoursesService } from '../../@core/data/course.service';
import { Exam, ExamService } from '../../@core/data/exams.service';
import { EditComponent } from '../exams/edit/edit.component';
import { DeleteComponent } from '../exams/delete/delete.component';
import { Todo, TodosService } from '../../@core/data/todos.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  a: {};
  a2: {};

  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  loadingExams: boolean = false;
  exams: Exam[] = [];

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: any): void => {
        this.editExam(event.exam);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: any): void => {
        this.deleteExam(event.exam);
      },
    },
  ];

  events: CalendarEvent[];

  private currentCourses: Course[] = [];

  loadingTodos = true;
  todos: Todo[];

  constructor(
    readonly auth: NbAuthService,
    public auth2: AngularFireAuth,
    private readonly examService: ExamService,
    private readonly courseService: CoursesService,
    private readonly datepipe: DatePipe,
    private readonly dialogService: NbDialogService,
    private readonly todosService: TodosService,
  ) {
    this.auth.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.a = token.getPayload();
    });

    this.auth2.user.subscribe((u) => (this.a2 = u));

    this.courseService.currentCourses.subscribe((courses) => {
      if (!courses) return;
      this.currentCourses = courses.creations.concat(courses.participations);
    });
  }

  formatTime(time: string): string {
    return this.datepipe.transform(time, 'HH:mm');
  }

  async reload() {
    this.loadingExams = true;
    this.loadingTodos = true;

    this.courseService.currentCourses.subscribe(async (courses) => {
      if (!courses) return;
      this.currentCourses = courses.creations.concat(courses.participations);

      this.todosService.get().then((v) => {
        this.loadingTodos = false;
        this.todos = v
          .filter(({ endDate }) => endDate)
          .filter((todo) => {
            const difference = this.getDeadlineDiffernce(todo);
            return difference < 7 && difference > 0;
          })
          .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
      });

      this.exams = await this.examService.getChunked(
        this.currentCourses,
        (chunk) =>
          this.examService
            .getCollection()
            .where(
              'course',
              'in',
              chunk.map(({ id }) => this.courseService.createRef(id)),
            )
            .get(),
        (snap) => this.examService.getData(snap),
      );

      this.events = this.exams.map((exam: Exam) => ({
        start: exam.date as any,
        end: exam.date as any,
        title: `${exam.title} - ${this.formatTime(exam.time)} - ${exam.room}`,
        actions: this.actions,
        color: {
          primary: '#e10217',
          secondary: '#e10217',
        },
        exam: exam,
      }));

      this.loadingExams = false;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  editExam(exam: Exam) {
    this.dialogService
      .open(EditComponent, {
        context: {
          courseId: exam.course.id,
          exam,
        },
      })
      .onClose.subscribe(async () => {
        await this.reload();
      });
  }

  deleteExam(exam: Exam) {
    this.dialogService
      .open(DeleteComponent, {
        context: {
          courseId: exam.course.id,
          exam,
        },
      })
      .onClose.subscribe(async () => {
        await this.reload();
        this.activeDayIsOpen = false;
      });
  }

  getDeadlineDiffernce({ endDate }: Todo) {
    if (!endDate) return;
    return differenceInCalendarDays(endDate, Date.now());
  }
}
