import { Component, OnInit } from '@angular/core';
import { NbDialogConfig, NbDialogService } from '@nebular/theme';
import { AddComponent } from './add/add.component';
import { Todo } from './todo.type';
import { TodosService } from './todos.service';

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  items: Todo[] = [];

  loading = true;

  constructor(
    private readonly todosService: TodosService,
    private readonly dialogService: NbDialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.reload();
  }

  private reload() {
    this.loading = true;
    this.todosService.get().then((v) => {
      this.items = v;
      this.loading = false;
    });
  }

  loadNext() {}

  openAddDialog(model?: Todo) {
    const options: Partial<NbDialogConfig> = {};
    if (model) {
      options.context = { model };
    }

    this.dialogService.open(AddComponent, options).onClose.subscribe((v) => {
      if (v) this.reload();
    });
  }

  async toggleCompleted(checked: boolean, todo: Todo) {//TODO: add delayed write?
    todo.completed = checked;
    await this.todosService.upsert(todo);
  }
}
