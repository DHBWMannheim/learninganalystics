import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Exam, ExamService } from '../../../@core/data/exams.service';

@Component({
  selector: 'ngx-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  courseId: string;
  exam: Exam;

  constructor(
    private readonly dialogRef: NbDialogRef<DeleteComponent>,
    private readonly examService: ExamService,
    private readonly toastrService: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.examService.delete(this.exam.id);
    this.toastrService.success(
      await this.translate.get('exams.delete.toast.deleted.message').toPromise(),
      await this.translate.get('exams.delete.toast.deleted.title').toPromise(),
    );
    this.close();
  }
}