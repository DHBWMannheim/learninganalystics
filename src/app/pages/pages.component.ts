import { Component, OnInit } from '@angular/core';
import { NbSearchService } from '@nebular/theme';
import { map } from 'rxjs/operators';
import { Course, CoursesService } from '../@core/data/course.service';
import { FilesService, FireFile } from '../@core/data/files.service';
import { Todo, TodosService } from '../@core/data/todos.service';
import { UserService } from '../@core/data/user.service';
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

  constructor(
    private readonly search: NbSearchService,
    private readonly coursesService: CoursesService,
    private readonly filesService: FilesService,
    private readonly todosService: TodosService,
    private readonly userService: UserService,

  ) { }
  ngOnInit(): void {
    this.menu = PRE_COURSE_MENU_ITEMS.concat(POST_COURSE_MENU_ITEMS);

    this.search.onSearchSubmit().subscribe(async ({ term }) => {
      this.userId = ((await this.userService.currentUser).id);
      var searchTerm = new RegExp(term.toLocaleLowerCase());
      this.items = await this.todosService.get();
      var todos: Todo[] = [];
      for (let item of this.items) {
        if (item.title.toLowerCase().match(searchTerm).length > 0 || item.description.toLowerCase().match(searchTerm).length > 0) {
          todos.push(item)
        } else {
        }
      }
      console.log(todos);

      this.courses = await this.coursesService.get();
      this.courses.forEach(async element => {
        if (this.userId === ((await this.userService.get(element.creator.id)).id)) {
          this.coursesNew.push(element);
        } else { }
      });

      this.files = await this.filesService.getData(
        await this.filesService
          .getCollection()
          .get(),
      );

      var newFiles: FireFile[] = [];
      this.files.forEach(async element => {
        if (this.coursesNew.includes(await this.coursesService.get(element.id)) && element.filename.toLowerCase().match(searchTerm)) {
          newFiles.push(element)
        }
      });
      console.log(newFiles);
    });

    this.coursesService.currentCourses
      .pipe(
        map((courses) =>
          courses.creations
            .concat(courses.participations)
            .flatMap((course) => this.mapCourseToMenu(course)),
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

  private findReg = function (match) {
    var reg = new RegExp(match);

    return this.filter(function (item) {
      return typeof item == 'string' && item.match(reg);
    });
  }
}
