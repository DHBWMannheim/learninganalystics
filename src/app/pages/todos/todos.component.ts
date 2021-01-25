import { Component, OnInit } from '@angular/core';
import { TodosService } from './todos.service';

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  items = [];

  constructor(private readonly todosService:TodosService) { }

  ngOnInit(): void {
    this.items = this.todosService.get()
  }

  loadNext() {

  }

}
