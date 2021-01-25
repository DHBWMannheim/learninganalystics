import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddComponent } from './add/add.component';
import { TodosService } from './todos.service';

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  items = [];

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

  openAddDialog() {
    this.dialogService.open(AddComponent).onClose.subscribe((v) => {
      console.log(v);
      this.reload();
    });
  }
}
