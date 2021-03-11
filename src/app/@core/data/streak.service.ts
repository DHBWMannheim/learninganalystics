import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { IndexCardPersistence } from './index-cards.service';

export interface IndexCardStreak extends CommonFirestoreDocument {
  indexCard: DocumentReference<IndexCardPersistence>;
  userId: string; // user ID
  streak: number;
  streakSince: number;
}

@Injectable({ providedIn: 'root' })
export class StreakService extends CommonFirestoreService<IndexCardStreak> {
  constructor(firestore: AngularFirestore) {
    super('card-streaks', firestore);
  }
}
