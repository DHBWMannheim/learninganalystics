import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import { IndexCardsService } from '../../../@core/data/index-cards.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  model = {
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
    private readonly translate: TranslateService,
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
    this.toastrService.success(
      await this.translate
        .get('indexCards.add.toast.saved.message')
        .toPromise(),
      await this.translate.get('indexCards.add.toast.saved.title').toPromise(),
    );
    this.close();
  }
}
