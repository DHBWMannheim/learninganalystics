import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSearchService } from '@nebular/theme';
import { map } from 'rxjs/operators';

import { Course, CoursesService } from '../@core/data/course.service';
import { POST_COURSE_MENU_ITEMS, PRE_COURSE_MENU_ITEMS } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';

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
        map((courses) =>
          courses.creations
            .concat(courses.participations)
            .flatMap((course) => this.mapCourseToMenu(course)),
        ),
      )
      .subscribe(async (menuItems) => {
        this.buildMenu(menuItems);
      });
  }

  private async buildMenu(courses: NbMenuItem[] = []) {
    this.menu = (await PRE_COURSE_MENU_ITEMS(this.translate))
      .concat(courses)
      .concat(await POST_COURSE_MENU_ITEMS(this.translate));
  }

  private mapCourseToMenu(course: Course) {
    return {
      title: course.name,
      icon: 'book-outline',
      children: [
        {
          title: 'Exams',
          icon: 'award-outline',
          link: '/pages/exams/' + course.id,
        },
        {
          title: 'Files',
          icon: 'file-outline',
          link: '/pages/files/' + course.id,
        },
        {
          title: 'Index Cards',
          icon: 'bookmark-outline',
          link: '/pages/index-cards/' + course.id,
        },
        {
          title: 'Feedback',
          icon: 'message-square-outline',
          link: '/pages/feedback/' + course.id,
        },
      ],
    };
  }
}
