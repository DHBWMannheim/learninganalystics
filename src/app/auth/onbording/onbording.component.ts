import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { QuestionareService } from '../../@core/data/questionare.service';
import { UserService } from '../../@core/data/user.service';

@Component({
  selector: 'ngx-onbording',
  templateUrl: './onbording.component.html',
  styleUrls: ['./onbording.component.scss'],
})
export class OnbordingComponent implements OnInit {
  form = new FormGroup({
    typ: new FormControl(null, [Validators.required]),
    online: new FormControl(null, [Validators.required]),
    apps: new FormControl(null, [Validators.required]),
    experience: new FormControl(null, [Validators.required]),
  });

  constructor(
    private readonly questionareService: QuestionareService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly toast: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  //TODO: Route here after registration
  ngOnInit(): void {}

  async submit() {
    await this.questionareService.upsert({
      typ: this.form.get('typ').value,
      online: this.form.get('online').value,
      apps: this.form.get('apps').value,
      experience: this.form.get('experience').value,
      user: this.userService.createRef((await this.userService.currentUser).id),
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
