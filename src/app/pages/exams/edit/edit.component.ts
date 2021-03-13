import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    duration: new FormControl(60, [Validators.required]),
    room: new FormControl('', [Validators.required]),
    tools: new FormControl(''),
    additionalInformations: new FormControl(''),
  });

  constructor(
    private readonly dialogRef: NbDialogRef<EditComponent>,
    private readonly examService: ExamService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.formGroup.get('title').setValue(this.exam.title);
    this.formGroup.get('description').setValue(this.exam.description);
    this.formGroup.get('date').setValue(this.exam.date);
    this.formGroup.get('time').setValue(this.exam.time);
    this.formGroup.get('duration').setValue(this.exam.duration);
    this.formGroup.get('room').setValue(this.exam.room);
    this.formGroup.get('tools').setValue(this.exam.tools);
    this.formGroup.get('additionalInformations').setValue(this.exam.additionalInformations);
  }

  private convertToObject() {
    return {
      title: this.formGroup.get('title').value,
      date: this.formGroup.get('date').value,
      time: this.formGroup.get('time').value,
      description: this.formGroup.get('description').value,
      duration: this.formGroup.get('duration').value,
      room: this.formGroup.get('room').value,
      tools: this.formGroup.get('tools').value,
      additionalInformations: this.formGroup.get('additionalInformations')
        .value,
    };
  }

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.examService.upsert({
      ...this.convertToObject(),
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
