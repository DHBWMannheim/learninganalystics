import { Component, OnInit } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { chunk } from 'lodash';
import { map, take } from 'rxjs/operators';
import { CoursesService } from '../../@core/data/course.service';
import { FilesService, FireFile } from '../../@core/data/files.service';
import {
  IndexCard,
  IndexCardsService,
} from '../../@core/data/index-cards.service';
import { Todo, TodosService } from '../../@core/data/todos.service';
import { UserService } from '../../@core/data/user.service';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  results: any;

  constructor(
    private readonly filesService: FilesService,
    private readonly coursesService: CoursesService,
    private readonly todoService: TodosService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly indexCardsService: IndexCardsService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async ({ term }) => {
      this.results = await this.search(term);
    });
  }

  public async search(term: string) {
    const currentCourses = await this.coursesService.currentCourses
      .pipe(
        take(1),
        map((courses) => [...courses.creations, ...courses.participations]),
        map((courses) => courses.map((course) => course.id)),
      )
      .toPromise();

    return {
      todos: await this.searchTodos(term),
      files: await this.searchFiles(term, currentCourses),
      indexCards: await this.searchIndexFiles(term, currentCourses),
    };
  }

  private async searchTodos(term: string){
    const allTodos = await this.todoService.get();
    const searchResultsTitle = this.containsInsensitiv(
      term,
      allTodos.map((todo) => ({ id: todo.id, searcharg: todo.title })),
    );
    const searchResultsDescription = this.containsInsensitiv(
      term,
      allTodos.map((todo) => ({ id: todo.id, searcharg: todo.description })),
    );
    return this.filterUniqueIds([
      ...searchResultsTitle,
      ...searchResultsDescription,
    ]);
  }

  private async searchFiles(term: string, courseIds: string[]) {
    const files = await this.loadChunked(
      courseIds,
      (chunk) =>
        this.filesService
          .getCollection()
          .where(
            'course',
            'in',
            chunk.map((id) => this.coursesService.createRef(id)),
          )
          .get(),
      (snap) => this.filesService.getData(snap),
    );

    return this.containsInsensitiv(
      term,
      files.map((file) => ({ id: file.id, searcharg: file.filename })),
    );
  }

  private async searchIndexFiles(term: string, courseIds: string[]) {
    const indexCards = await this.loadChunked(
      courseIds,
      (chunk) =>
        this.indexCardsService
          .getCollection()
          .where(
            'course',
            'in',
            chunk.map((id) => this.coursesService.createRef(id)),
          )
          .get(),
      (data) => this.indexCardsService.getData(data),
    );

    const questionResult = this.containsInsensitiv(
      term,
      indexCards.map((card) => ({ id: card.id, searcharg: card.question })),
    );

    const answerResult = this.containsInsensitiv(
      term,
      indexCards.map((card) => ({ id: card.id, searcharg: card.answer })),
    );

    return this.filterUniqueIds([...questionResult, ...answerResult]);
  }

  private async loadChunked<T, K>(
    elements: T[],
    loadSnapshot: (chunk: T[]) => QuerySnapshot<K> | Promise<QuerySnapshot<K>>,
    getData: (
      snap: QuerySnapshot<K> | Promise<QuerySnapshot<K>>,
    ) => Promise<K[]>,
  ): Promise<K[]> {
    return (
      await Promise.all(
        chunk(elements, 10)
          .map((chunk) => loadSnapshot(chunk))
          .map((snap) => getData(snap)),
      )
    ).reduce((acc, curr) => acc.concat(curr), []);
  }

  private containsInsensitiv(
    term: string,
    searchItems: { id: string; searcharg: string }[],
  ) {
    const reg = new RegExp(`${term}`, 'i');
    return searchItems.filter(({ searcharg }) => reg.test(searcharg));
  }

  private filterUniqueIds<T extends { id: string }>(array: T[]) {
    const m = new Map<string, T>();
    array.forEach((a) => m.set(a.id, a));
    return [...m.values()];
  }
}
