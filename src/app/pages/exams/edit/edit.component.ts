import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import { Exam, ExamService } from '../../../@core/data/exams.service';

@Component({
  selector: 'ngx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  courseId: string;
  exam: Exam;

  constructor(
    private readonly dialogRef: NbDialogRef<EditComponent>,
    private readonly examService: ExamService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.examService.upsert({
      ...this.exam,
      course: this.coursesService.createRef(this.courseId),
    });
    this.toastrService.success(
      await this.translate.get('exams.edit.toast.saved.message').toPromise(),
      await this.translate.get('exams.edit.toast.saved.title').toPromise(),
    );
    this.close();
  }
}
