import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { Course } from './course.service';

export interface Exam extends CommonFirestoreDocument {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  duration: number;
  room: string;
  tools: string;
  additionalInformations: string;
  course: DocumentReference<Course>;
}

@Injectable({ providedIn: 'root' })
export class ExamService extends CommonFirestoreService<Exam> {
  constructor(firestore: AngularFirestore) {
    super('exams', firestore);
  }
}
