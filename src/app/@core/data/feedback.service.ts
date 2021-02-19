import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { Course } from './course.service';
import { User } from './user.service';

export interface Feedback extends CommonFirestoreDocument {
  id?: string;
  course: DocumentReference<Course>;
  user: DocumentReference<User>;
  quality: number;
  transfer: number;
  fun: number;
  informations: number;
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService extends CommonFirestoreService<Feedback> {
  constructor(firestore: AngularFirestore) {
    super('feedbacks', firestore);
  }
}
