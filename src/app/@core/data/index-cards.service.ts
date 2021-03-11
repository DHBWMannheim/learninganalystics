import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { Course } from './course.service';
import { User } from './user.service';

export interface IndexCard extends CommonFirestoreDocument {
  id?: string;
  question: string;
  answer: string;
  course: DocumentReference<Course>;
  streak: number;
  streakSince: number;
  owner: DocumentReference<User>;
}

@Injectable({ providedIn: 'root' })
export class IndexCardsService extends CommonFirestoreService<IndexCard> {
  constructor(firestore: AngularFirestore) {
    super('index-cards', firestore);
  }
}
