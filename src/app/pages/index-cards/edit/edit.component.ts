import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import {
  IndexCard,
  IndexCardsService,
} from '../../../@core/data/index-cards.service';

@Component({
  selector: 'ngx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  courseId: string;
  card: IndexCard;

  constructor(
    private readonly dialogRef: NbDialogRef<EditComponent>,
    private readonly indexCardsService: IndexCardsService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.indexCardsService.upsert({
      id: this.card.id,
      question: this.card.question,
      answer: this.card.answer,
      course: this.coursesService.createRef(this.courseId),
    });
    this.toastrService.success(
      await this.translate.get('indexCards.edit.toast.saved.message'),
      await this.translate.get('indexCards.edit.toast.saved.title'),
    );
    this.close();
  }
}
