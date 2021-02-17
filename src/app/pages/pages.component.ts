import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSearchService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs/operators';

import { Course, CoursesService } from '../@core/data/course.service';
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
  menu = [];

  constructor(
    private readonly search: NbSearchService,
    private readonly coursesService: CoursesService,
    private readonly translate: TranslateService,
  ) {}
  async ngOnInit(): Promise<void> {
    this.buildMenu();

    this.search.onSearchSubmit().subscribe(({ term }) => {
      console.log('TODO: SEARCH:', term);
    });

    this.coursesService.currentCourses
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
      .subscribe((menuItems) => this.buildMenu(menuItems));
  }

  private async buildMenu(courses: NbMenuItem[] = []) {
    this.menu = (await PRE_COURSE_MENU_ITEMS(this.translate))
      .concat(courses)
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
