import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Todo } from '../todo.type';
import { TodosService } from '../todos.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  model: Todo = {
    title: '',
    description: '',
  };

  constructor(
    private readonly dialogRef: NbDialogRef<AddComponent>,
    private readonly todosService: TodosService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(this.model);
  }

  async submit() {
    await this.todosService.upsert(this.model);
    this.close();
  }
}
