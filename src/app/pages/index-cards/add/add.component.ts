import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../../@core/data/course.service';
import { IndexCardsService } from '../../../@core/data/index-cards.service';
import { UserService } from '../../../@core/data/user.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  formGroup = new FormGroup({
    question: new FormControl('', [Validators.required]),
    answer: new FormControl('', [Validators.required])
  })

  courseId: string;

  constructor(
    private readonly dialogRef: NbDialogRef<AddComponent>,
    private readonly indexCardsService: IndexCardsService,
    private readonly toastrService: NbToastrService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(this.convertToObject());
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
      ...this.convertToObject(),
      course: this.coursesService.createRef(this.courseId),
      owner: this.userService.createRef(currentUser),
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
