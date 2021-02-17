import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CoursesService } from '../../../@core/data/course.service';
import { IndexCardsService } from '../../../@core/data/index-cards.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  // TODO: Mit dem add component vom todo zusammenziehen

  model = {
    // TODO: Owner, course, ...
    question: '',
    answer: '',
    course: null,
  };

  courseId: string;

  constructor(
    private readonly dialogRef: NbDialogRef<AddComponent>,
    private readonly indexCardsService: IndexCardsService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(this.model);
  }

  async submit() {
    await this.indexCardsService.upsert({
      ...this.model,
      course: this.coursesService.createRef(this.courseId),
    });
    this.toastrService.show('Saved', 'Saved successfully', {
      status: 'success',
    });
    this.close();
  }
}
