import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { User } from './user.service';

export interface Questionare extends CommonFirestoreDocument {
  user: DocumentReference<User>;
  typ: number;
  online: number;
  apps: number;
  experience: number;
}

@Injectable({ providedIn: 'root' })
export class QuestionareService extends CommonFirestoreService<Questionare> {
  constructor(firestore: AngularFirestore) {
    super('questionare', firestore);
  }
}
