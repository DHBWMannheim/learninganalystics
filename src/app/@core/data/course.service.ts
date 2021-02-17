import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { User, UserService } from './user.service';

const KEY_LENGTH = 6;
const KEY_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export interface Course extends CommonFirestoreDocument {
  name: string;
  key: string;
  creator: DocumentReference<User>;
  participants: DocumentReference<User>[];
}

export interface RelevantCourses {
  creations: Course[];
  participations: Course[];
}

@Injectable({ providedIn: 'root' })
export class CoursesService extends CommonFirestoreService<Course> {
  private _currentCourses = new ReplaySubject<RelevantCourses>(1);

  constructor(
    firestore: AngularFirestore,
    private readonly userService: UserService,
  ) {
    super('courses', firestore);
    this.refreshCourses();
  }

  async createCourse(name: string) {
    const currentUser = await this.userService.currentUser;

    const document = this.getCollection().doc();

    await this.upsert({
      id: document.id,
      name,
      creator: this.userService.createRef(currentUser.id),
      key: document.id.substring(0, 6).toLowerCase(),
      participants: [],
    });
    await this.refreshCourses();
  }

  async joinCourse(key: string) {
    const relevant = await this.getCollection()
      .where('key', '==', key.toLowerCase())
      .limit(1)
      .get();
    // TODO: gibt es da eine bessere Möglichkeit? z.B. als seperate Join-tabelle
    // + Rules darf student keinen namen ändern
    const doc = relevant.docs[0];
    if (!doc) throw new Error('TODO_ERROR'); //TODO: Toast
    // TODO: Already Joined/not student/dozent mix
    const course = doc.data();

    const currentUser = await this.userService.currentUser;

    course.participants.push(this.userService.createRef(currentUser.id));

    await this.upsert(course);
    await this.refreshCourses();
  }

  private async refreshCourses() {
    const currentUser = await this.userService.currentUser;
    const currentUserRef = this.userService.createRef(currentUser.id);
    const ownedCourses = await this.getCollection()
      .where('creator', '==', currentUserRef)
      .get();

    const participantCourses = await this.getCollection()
      .where('participants', 'array-contains', currentUserRef)
      .get();

    // create a separate query for each OR condition and merge the query results in your app.
    this._currentCourses.next({
      creations: await this.getData(ownedCourses),
      participations: await this.getData(participantCourses),
    });
  }

  get currentCourses() {
    return this._currentCourses.asObservable();
  }

  async isLecturer(course: string | Course): Promise<boolean> {
    const user = await this.userService.currentUser;
    if (typeof course === 'string') {
      const dbCourse = await this.get(course);
      return dbCourse.creator.id === user.id;
    }
    return course.creator.id === user.id;
  }
}
