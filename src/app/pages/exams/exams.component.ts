import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CoursesService } from '../../@core/data/course.service';
import { Exam, ExamService } from '../../@core/data/exams.service';
import { AddComponent } from './add/add.component';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'ngx-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {

  courseId: string;
  exams: Exam[] = [];
  loadingExams: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly examService: ExamService,
    private readonly datepipe: DatePipe,
    private readonly courseService: CoursesService,
    private readonly dialogService: NbDialogService,
  ) {}

  formatDate(date: string): string {
    return this.datepipe.transform(date, 'dd.MM.yyyy');
  }

  formatTime(time: string): string {
    return this.datepipe.transform(time, 'HH:mm');
  }

  async reload() {
    this.loadingExams = true;
    this.exams = await this.examService.getData(
      await this.examService
        .getCollection()
        .where('course', '==', this.courseService.createRef(this.courseId))
        .get(),
    );
    this.loadingExams = false;
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      await this.reload()
    });
  }

  openAddDialog() {
    this.dialogService
      .open(AddComponent, {
        context: {
          courseId: this.courseId,
        },
      })
      .onClose.subscribe(async () => {
        await this.reload();
      });
  }

  editExam(exam: Exam) {
    this.dialogService
      .open(EditComponent, {
        context: {
          courseId: this.courseId,
          exam
        },
      })
      .onClose.subscribe(async () => {
        await this.reload()
      });
  }

  deleteExam(exam: Exam) {
    this.dialogService
      .open(DeleteComponent, {
        context: {
          courseId: this.courseId,
          exam
        },
      })
      .onClose.subscribe(async () => {
        await this.reload()
      });
  }
}
