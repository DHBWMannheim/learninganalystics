import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Todo, TodosService } from '../../../@core/data/todos.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  model: Omit<Todo, 'owner'> = { // TODO: ist omit ok oder sollte owner optional sein?
    title: '',
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
