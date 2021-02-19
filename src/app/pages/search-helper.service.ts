import { Injectable } from '@angular/core';
import { NbSearchService } from '@nebular/theme';
import { CoursesService } from '../@core/data/course.service';
import { FilesService } from '../@core/data/files.service';
import { TodosService } from '../@core/data/todos.service';
import { UserService } from '../@core/data/user.service';

@Injectable({
  providedIn: 'root',
})
export class SearchHelperService {
  constructor(
    private readonly userService: UserService,
    private readonly filesService: FilesService,
    private readonly courseService: CoursesService,
    private readonly todoService: TodosService,
  ) {}

  public async search(term: string) {
    
    return this.searchTodos(term);
  }

  private async searchTodos(term: string) {
    const allTodos = await this.todoService.get();
    const searchResultsTitle = this.containsInsensitiv(
      term,
      allTodos.map((todo) => ({ id: todo.id, searcharg: todo.title })),
    );
    return searchResultsTitle
  }

  private async searchFiles() {
    //TODO:
  }

  private async searchExams() {
    //TODO:
  }

  private async searchCourses() {
    //TODO:
  }

  private containsInsensitiv(
    term: string,
    searchItems: { id: string; searcharg: string }[],
  ) {
    const reg = new RegExp(`/${term}/i`);
    return searchItems.filter(({ searcharg }) => searcharg.match(reg));
  }

  private filterUniqueIds(array: {id:string}[]) {
    return array; //TODO:
  }
}
