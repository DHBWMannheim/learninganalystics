import { Component, OnInit } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { chunk } from 'lodash';
import { map, take } from 'rxjs/operators';

import { CommonFirestoreDocument } from '../../@core/data/common-firestore-document';
import { CoursesService } from '../../@core/data/course.service';
import { FilesService, FireFile } from '../../@core/data/files.service';
import {
  IndexCard,
  IndexCardsService,
} from '../../@core/data/index-cards.service';
import { Todo, TodosService } from '../../@core/data/todos.service';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  resultsTodos: Todo[];
  resultsFiles: FireFile[];
  resultsIndexCards: IndexCard[];

  constructor(
    private readonly filesService: FilesService,
    private readonly coursesService: CoursesService,
    private readonly todoService: TodosService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly indexCardsService: IndexCardsService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(({ term }) => {
      this.resultsFiles = null;
      this.resultsTodos = null;
      this.resultsIndexCards = null;
      this.search(term)
    });
  }

  public async search(term: string) {
    const todos = this.searchTodos(term).then(
      (results) => (this.resultsTodos = results),
    );

    const currentCourses = await this.coursesService.currentCourses
      .pipe(
        take(1),
        map((courses) => [...courses.creations, ...courses.participations]),
        map((courses) => courses.map((course) => course.id)),
      )
      .toPromise();

    const files = this.searchFiles(term, currentCourses).then(
      (results) => (this.resultsFiles = results),
    );
    const indexCards = this.searchIndexFiles(term, currentCourses).then(
      (results) => (this.resultsIndexCards = results),
    );
    await Promise.all([todos, files, indexCards]);
  }

  private async searchTodos(term: string) {
    const allTodos = await this.todoService.get();
    const searchResultsTitle = this.containsInsensitiv(
      term,
      allTodos.map((todo) => ({ document: todo, searcharg: todo.title })),
    );
    const searchResultsDescription = this.containsInsensitiv(
      term,
      allTodos.map((todo) => ({ document: todo, searcharg: todo.description })),
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
      files.map((file) => ({ document: file, searcharg: file.filename })),
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
      indexCards.map((card) => ({ document: card, searcharg: card.question })),
    );

    const answerResult = this.containsInsensitiv(
      term,
      indexCards.map((card) => ({ document: card, searcharg: card.answer })),
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

  private containsInsensitiv<T>(
    term: string,
    searchItems: { document: T; searcharg: string }[],
  ): T[] {
    const reg = new RegExp(term, 'i');
    return searchItems
      .filter(({ searcharg }) => reg.test(searcharg))
      .map((item) => item.document);
  }

  private filterUniqueIds<T extends CommonFirestoreDocument>(array: T[]) {
    const m = new Map<string, T>();
    array.forEach((a) => m.set(a.id, a));
    return [...m.values()];
  }
}
