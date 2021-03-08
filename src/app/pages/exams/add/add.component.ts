import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import { ExamService } from '../../../@core/data/exams.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  model = {
    title: '',
    date: '',
    time: '',
    description: '',
    duration: 60,
    room: '',
    tools: '',
    additionalInformations: ''
  };

  courseId: string;

  constructor(
    private readonly dialogRef: NbDialogRef<AddComponent>,
    private readonly examService: ExamService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(this.model);
  }

  async submit() {
    await this.examService.upsert({
      ...this.model,
      course: this.coursesService.createRef(this.courseId)
    });
    this.toastrService.success(
      await this.translate.get('exams.add.toast.saved.message').toPromise(),
      await this.translate.get('exams.add.toast.saved.title').toPromise(),
    );
    this.close();
  }
}
