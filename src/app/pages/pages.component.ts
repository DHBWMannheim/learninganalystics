import { Component, OnInit } from '@angular/core';
import { NbSearchService } from '@nebular/theme';
import { flatMap, map, mergeMap } from 'rxjs/operators';
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
  ) {}
  ngOnInit(): void {
    this.menu = PRE_COURSE_MENU_ITEMS.concat(POST_COURSE_MENU_ITEMS);

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
        map((courses) =>
          courses.sort((a, b) =>
            a.title < b.title ? -1 : a.title > b.title ? 1 : 0,
          ),
        ),
      )
      .subscribe((v) => {
        this.menu = PRE_COURSE_MENU_ITEMS.concat(v).concat(
          POST_COURSE_MENU_ITEMS,
        );
      });
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
