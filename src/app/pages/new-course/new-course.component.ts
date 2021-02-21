import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  Course,
  CoursesService,
  RelevantCourses,
} from '../../@core/data/course.service';
import { DeleteComponent } from './delete/delete.component';

@Component({
  selector: 'ngx-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss'],
})
export class NewCourseComponent implements OnInit {
  joinForm = new FormGroup({
    key: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  createForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  loadingJoin = false;
  loadingCreate = false;

  currentCourses: Observable<RelevantCourses>;

  constructor(
    private readonly coursesService: CoursesService,
    private readonly toast: NbToastrService,
    private readonly translate: TranslateService,
    private readonly dialogService: NbDialogService,
  ) {}

  ngOnInit(): void {
    this.currentCourses = this.coursesService.currentCourses;
  }

  async joinCourse() {
    this.loadingJoin = true;
    const key = this.joinForm.get('key').value.toLowerCase();
    this.joinForm.reset();

    const relevantCourses = await this.currentCourses.pipe(take(1)).toPromise();
    if (
      relevantCourses.creations.some((course) => course.key === key) ||
      relevantCourses.participations.some((course) => course.key === key)
    ) {
      this.toast.danger(
        await this.translate.get('join.toast.conflict.message').toPromise(),
        await this.translate.get('join.toast.conflict.title').toPromise(),
      );
    } else {
      await this.coursesService.joinCourse(key);
    }

    this.loadingJoin = false;
  }

  async createCourse() {
    this.loadingCreate = true;
    const name = this.createForm.get('name').value;
    this.createForm.reset();
    await this.coursesService.createCourse(name);
    this.loadingCreate = false;
  }

  async leaveCourse(course: Course) {
    await this.dialogService
      .open(DeleteComponent, {
        context: {
          course,
        },
      })
      .onClose.toPromise();
  }
}
