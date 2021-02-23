import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Questionare, QuestionareService } from '../../data/questionare.service';
import { UserService } from '../../data/user.service';

@Component({
  selector: 'ngx-questionare',
  templateUrl: './questionare.component.html',
  styleUrls: ['./questionare.component.scss']
})
export class QuestionareComponent {


  form = new FormGroup({
    typ: new FormControl(null, [Validators.required]),
    online: new FormControl(null, [Validators.required]),
    apps: new FormControl(null, [Validators.required]),
    experience: new FormControl(null, [Validators.required]),
  });

  private currentDoc: Questionare;

  constructor(
    private readonly questionareService: QuestionareService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly toast: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  async ngOnInit() {
    this.currentDoc = (
      await this.questionareService.getData(
        await this.questionareService
          .getCollection()
          .where('user', '==', await this.createCurrentUserRef())
          .get(),
      )
    )[0];
    console.log(this.currentDoc);
    this.form.get('typ').setValue(this.currentDoc?.typ);
    this.form.get('online').setValue(this.currentDoc?.online);
    this.form.get('apps').setValue(this.currentDoc?.apps);
    this.form.get('experience').setValue(this.currentDoc?.experience);
  }

  private async createCurrentUserRef() {
    return this.userService.createRef((await this.userService.currentUser).id);
  }

  async submit() {
    await this.questionareService.upsert({
      id: this.currentDoc?.id,
      typ: this.form.get('typ').value,
      online: this.form.get('online').value,
      apps: this.form.get('apps').value,
      experience: this.form.get('experience').value,
      user: await this.createCurrentUserRef(),
    });
    this.toast.success(
      await this.translate.get('questionare.toast.success.message').toPromise(),
      await this.translate.get('questionare.toast.success.title').toPromise(),
    );
    setTimeout(() => {
      this.router.navigate(['pages']);
    }, 500);
  }

  skip() {
    this.router.navigate(['pages']);
  }
}
