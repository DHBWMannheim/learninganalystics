import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { Course } from './course.service';

export interface IndexCard {
  id?: string;
  question: string;
  answer: string;
  course: DocumentReference<Course>;
  streak: number;
  streakSince: number;
  streakId: string;
}
export interface IndexCardPersistence extends CommonFirestoreDocument {
  id?: string;
  question: string;
  answer: string;
  course: DocumentReference<Course>;
}

@Injectable({ providedIn: 'root' })
export class IndexCardsService extends CommonFirestoreService<IndexCardPersistence> {
  constructor(firestore: AngularFirestore) {
    super('index-cards', firestore);
  }
}
