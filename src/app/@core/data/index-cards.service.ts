import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';

export interface IndexCard extends CommonFirestoreDocument {
  id?: string;
  question: string;
  answer: string;
  // TODO: Kurs, user
}

@Injectable({ providedIn: 'root' })
export class IndexCardsService extends CommonFirestoreService<IndexCard> {
  constructor(firestore: AngularFirestore) {
    super('index-cards', firestore);
  }
}
