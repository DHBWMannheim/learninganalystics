import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

import { Todo, TodosService } from '../../../@core/data/todos.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  inputModel: Omit<Todo, 'owner'>; //TODO: fix input

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(
    private readonly dialogRef: NbDialogRef<AddComponent>,
    private readonly todosService: TodosService,
    private readonly toastrService: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.inputModel) {
      this.formGroup.get('title').setValue(this.inputModel.title);
      this.formGroup.get('startDate').setValue(this.inputModel.startDate);
      this.formGroup.get('endDate').setValue(this.inputModel.endDate);
      this.formGroup.get('description').setValue(this.inputModel.description);
    }
  }

  close(reload = false) {
    this.dialogRef.close(reload);
  }

  async submit() {
    await this.todosService.upsert({
      title: this.formGroup.get('title').value,
      description: this.formGroup.get('description').value,
      // completed
      endDate: this.formGroup.get('endDate').value,
      startDate: this.formGroup.get('startDate').value,
      completed: !!this.inputModel?.completed,
      id: this.inputModel?.id,
    });
    this.toastrService.success(
      await this.translate.get('todos.add.toast.saved.message').toPromise(),
      await this.translate.get('todos.add.toast.saved.title').toPromise(),
    );
    this.close(true);
  }
}
