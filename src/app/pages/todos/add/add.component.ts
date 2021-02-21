import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Todo, TodosService } from '../../../@core/data/todos.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  model: Omit<Todo, 'owner'> = {
    title: '',
  };

  constructor(
    private readonly dialogRef: NbDialogRef<AddComponent>,
    private readonly todosService: TodosService,
    private readonly toastrService: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(this.model);
  }

  async submit() {
    await this.todosService.upsert(this.model);
    this.toastrService.success(
      await this.translate.get('todos.add.toast.saved.message').toPromise(),
      await this.translate.get('todos.add.toast.saved.title').toPromise(),
    );
    this.close();
  }
}
