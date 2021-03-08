import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { take, skipWhile, filter } from 'rxjs/operators';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { Course, CoursesService } from './course.service';
import { UserService } from './user.service';

export interface Exam extends CommonFirestoreDocument {
  title: string;
  deadline: string;
  description: string;
  duration: string;
  room: string;
  tools: string[];
  additionalInformations: string[];
  course: DocumentReference<Course>;
}

@Injectable({ providedIn: 'root' })
export class ExamService extends CommonFirestoreService<Exam> {
  constructor(firestore: AngularFirestore) {
    super('exams', firestore);
  }
}
