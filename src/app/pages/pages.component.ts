import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbSearchService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  Course,
  CoursesService,
  RelevantCourses,
} from '../@core/data/course.service';
import { FireFile } from '../@core/data/files.service';
import { Todo } from '../@core/data/todos.service';
import { POST_COURSE_MENU_ITEMS, PRE_COURSE_MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <main-layout>
      <nb-menu [items]="menu" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </main-layout>
  `,
})
export class PagesComponent implements OnInit {
  files: FireFile[];
  items: Todo[] = [];
  courses: Course[] = [];
  coursesNew: Course[] = [];
  userId = '';
  menu = [];
  private currentCourses: RelevantCourses;

  constructor(
    private readonly search: NbSearchService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
    private readonly router: Router,
  ) {}
  async ngOnInit(): Promise<void> {
    this.search
      .onSearchSubmit()
      .subscribe(({ term }) =>
        this.router.navigate(['pages', 'search'], { queryParams: { term } }),
      );

    this.coursesService.currentCourses.subscribe((courses) => {
      this.currentCourses = courses;
      this.buildMenu(this.currentCourses);
    });

    this.translate.onLangChange.subscribe(() => {
      this.buildMenu(this.currentCourses);
    });
    this.buildMenu(this.currentCourses);
  }

  private async buildMenu(relevantCourses: RelevantCourses) {
    let courseItems: NbMenuItem[] = [];
    if (relevantCourses) {
      courseItems = await of(relevantCourses)
        .pipe(
          switchMap((courses) =>
            Promise.all(
              courses.creations
                .concat(courses.participations)
                .flatMap((course) => this.mapCourseToMenu(course)),
            ),
          ),
          map((courses) =>
            courses.sort((a, b) =>
              a.title < b.title ? -1 : a.title > b.title ? 1 : 0,
            ),
          ),
        )
        .toPromise();
    }

    this.menu = (await PRE_COURSE_MENU_ITEMS(this.translate))
      .concat(courseItems)
      .concat(await POST_COURSE_MENU_ITEMS(this.translate));
  }

  private async mapCourseToMenu(course: Course) {
    return {
      title: course.name,
      icon: 'book-outline',
      children: [
        {
          title: await this.translate.get('menu.exams').toPromise(),
          icon: 'award-outline',
          link: '/pages/exams/' + course.id,
        },
        {
          title: await this.translate.get('menu.files').toPromise(),
          icon: 'file-outline',
          link: '/pages/files/' + course.id,
        },
        {
          title: await this.translate.get('menu.indexCards').toPromise(),
          icon: 'bookmark-outline',
          link: '/pages/index-cards/' + course.id,
        },
        {
          title: await this.translate.get('menu.feedback').toPromise(),
          icon: 'message-square-outline',
          link: '/pages/feedback/' + course.id,
        },
      ],
    };
  }
}
