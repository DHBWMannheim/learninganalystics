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
export class ExamsService extends CommonFirestoreService<Exam> {
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private courseService: CoursesService,
  ) {
    super('exams', firestore);
  }

  public async get(): Promise<Exam[]>;
  public async get(id: string): Promise<Exam>;
  public async get(id?: string): Promise<Exam | Exam[]> {
    if (id) {
      return this.createRef(id)
        .get()
        .then((doc) => doc.data());
    }
    const myCourses = await this.courseService.currentCourses
      .pipe(take(1))
      .toPromise()
      .then(({ participations, creations }) =>
        participations.concat(creations),
      );

    if (!myCourses.length) return [];

    const snap = await this.getCollection()
      .where(
        'course',
        'in',
        myCourses.map((c) => this.courseService.createRef(c.id)),
      )
      .get();
    return this.getData(snap);
  }
}
