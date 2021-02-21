import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Course,
  CoursesService,
  RelevantCourses,
} from '../../@core/data/course.service';

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
    private readonly router: Router,
    private readonly toast: NbToastrService,
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
        'Already joined',
        'You are already part of this course',
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
}
