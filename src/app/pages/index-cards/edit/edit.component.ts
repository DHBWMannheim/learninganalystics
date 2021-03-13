import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import {
  IndexCard,
  IndexCardsService,
} from '../../../@core/data/index-cards.service';
import { UserService } from '../../../@core/data/user.service';

@Component({
  selector: 'ngx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  courseId: string;
  card: IndexCard;

  formGroup = new FormGroup({
    question: new FormControl('', [Validators.required]),
    answer: new FormControl('', [Validators.required])
  })

  constructor(
    private readonly dialogRef: NbDialogRef<EditComponent>,
    private readonly indexCardsService: IndexCardsService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.formGroup.get('question').setValue(this.card.question)
    this.formGroup.get('answer').setValue(this.card.answer)
  }

  close() {
    this.dialogRef.close();
  }

  private convertToObject() {
    return {
      question: this.formGroup.get('question').value,
      answer: this.formGroup.get('answer').value
    }
  }


  async submit() {
    const currentUser = (await this.userService.currentUser).id; // TODO:

    await this.indexCardsService.upsert({
      id: this.card.id,
      ...this.convertToObject(),
      course: this.coursesService.createRef(this.courseId),
      owner: this.userService.createRef(currentUser),
    });
    this.toastrService.success(
      await this.translate
        .get('indexCards.edit.toast.saved.message')
        .toPromise(),
      await this.translate.get('indexCards.edit.toast.saved.title').toPromise(),
    );
    this.close();
  }
}
