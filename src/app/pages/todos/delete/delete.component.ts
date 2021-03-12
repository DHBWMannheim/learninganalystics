import { Component } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

import { Todo, TodosService } from '../../../@core/data/todos.service';

@Component({
  selector: 'ngx-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  todo: Todo;

  constructor(
    private readonly dialogRef: NbDialogRef<DeleteComponent>,
    private readonly todosService: TodosService,
    private readonly toastrService: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.todosService.delete(this.todo.id);
    this.toastrService.success(
      await this.translate
        .get('todos.delete.toast.deleted.message')
        .toPromise(),
      await this.translate.get('todos.delete.toast.deleted.title').toPromise(),
    );
    this.close();
  }
}
