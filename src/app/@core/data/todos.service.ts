import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-document.interface';
import { CommonFirestoreService } from './common-firestore.service';
import { User, UserService } from './user.service';

export interface Todo extends CommonFirestoreDocument {
  id?: string;
  title: string;
  description?: string;
  deadline?: Date;
  completed?: boolean;
  owner: DocumentReference<User>;
}

@Injectable({
  providedIn: 'root',
})
export class TodosService extends CommonFirestoreService<Todo> {
  constructor(
    firestore: AngularFirestore,
    private readonly userService: UserService,
  ) {
    super('todos', firestore);
  }

  public async get(): Promise<Todo[]>;
  public async get(id: string): Promise<Todo>;
  public async get(id?: string): Promise<Todo | Todo[]> {
    //TODO: Ist es besser die todos an einem nutzer zu speichern?
    if (id) {
      const idResult = await this.createRef(id).get(); // TODO: firestore-rule protect
      return idResult.data();
    }
    const userId = (await this.userService.currentUser)?.id;
    const snap = await this.getCollection()
      .where('owner', '==', this.userService.createRef(userId))
      .get();
    return this.getData(snap);
  }

  public async upsert(unit: Omit<Todo, 'owner'>) {
    const userId = (await this.userService.currentUser)?.id;
    const saveDto: Todo = {
      ...unit,
      owner: this.userService.createRef(userId), // TODO: wie gegen manipulation schützen
    };

    return unit.id
      ? this.createRef(unit.id).set(saveDto)
      : this.getCollection().add(saveDto);
  }
}
