import { Component } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

import { Course, CoursesService } from '../../../@core/data/course.service';

@Component({
  selector: 'ngx-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  course: Course;

  constructor(
    private readonly dialogRef: NbDialogRef<DeleteComponent>,
    private readonly toastrService: NbToastrService,
    private readonly translate: TranslateService,
    private readonly coursesService: CoursesService,
  ) {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    this.close();
    await this.coursesService.leaveCourse(this.course);
    this.toastrService.success(
      await this.translate.get('join.delete.toast.deleted.message').toPromise(),
      await this.translate.get('join.delete.toast.deleted.title').toPromise(),
    );
  }
}
