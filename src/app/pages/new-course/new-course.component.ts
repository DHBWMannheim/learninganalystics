import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from '../../@core/data/course.service';

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

  constructor(
    private readonly coursesService: CoursesService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  async joinCourse() {
    const key = this.joinForm.get('key').value;
    this.joinForm.reset();
    const courseId = await this.coursesService.joinCourse(key);
    this.navigate(courseId);
  }

  async createCourse() {
    const name = this.createForm.get('name').value;
    this.createForm.reset();
    const courseId = await this.coursesService.createCourse(name);
    this.navigate(courseId);
  }

  private navigate(courseId: string) {
    setTimeout(async () => {
      // TODO: das ist dirty
      await this.router.navigate(['pages', 'exams', courseId]);
    });
  }
}
