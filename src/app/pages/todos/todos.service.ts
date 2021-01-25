import { Injectable } from '@angular/core';
import { Todo } from './todo.type';
import { AngularFirestore } from '@angular/fire/firestore';
import { CommonFirestoreService } from './common-firestore.service';


@Injectable({
  providedIn: 'root',
})
export class TodosService extends CommonFirestoreService<Todo> {
  constructor(private readonly firestore: AngularFirestore) {
    super('todos', firestore);
  }
}
