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

    await this.coursesService.joinCourse(key);

    this.loadingJoin = false;
  }

  //TODO: In die Doku, dass wir gleiche namen erlauben, weil man ja auch joinen kann und es da komisch wäre, wenn man nicht joinen kann nur weil man einen gleichen schon hat
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
