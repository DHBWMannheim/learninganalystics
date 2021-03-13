import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
    this.dialogRef.close(this.convertToObject());
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

  async submit() {
    await this.examService.upsert({
      ...this.convertToObject(),
      course: this.coursesService.createRef(this.courseId),
    });
    this.toastrService.success(
      await this.translate.get('exams.add.toast.saved.message').toPromise(),
      await this.translate.get('exams.add.toast.saved.title').toPromise(),
    );
    this.close();
  }
}
