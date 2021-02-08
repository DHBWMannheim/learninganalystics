import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class CoursesService extends CommonFirestoreService<Course> {
  constructor(
    firestore: AngularFirestore,
    private readonly userService: UserService,
  ) {
    super('courses', firestore);
  }

  get currentCourse(): Observable<Course> {
    // TODO: Einschreiben
    return of({
      name: 'WWI18-SEA/C - Verteilte Systeme',
      key: 'woopey',
      creator: null,
      participants: null,
    }).pipe(share());
  }

  async TEMP_CREATE_COURSE(name: string) {
    const currentUser = await this.userService.currentUser;

    const document = this.getCollection().doc();

    await this.upsert({
      id: document.id,
      name,
      creator: this.userService.createRef(currentUser.id),
      key: document.id.substring(0, 6),
      participants: [],
    });
  }

  async TEMP_JOIN_COURSE(key: string) {
    const relevant = await this.getCollection()
      .where('key', '==', key)
      .limit(1)
      .get();
    // TODO: gibt es da eine bessere Möglichkeit? z.B. als seperate Join-tabelle
    // + Rules darf student keinen namen ändern
    const doc = relevant.docs[0];
    if (!doc) throw new Error('TODO_ERROR');
    const course = doc.data();

    const currentUser = await this.userService.currentUser;

    course.participants.push(this.userService.createRef(currentUser.id));

    await this.upsert(course);
  }

  async TEMP_GET_RELEVANT_COURSES() {
    const currentUser = await this.userService.currentUser;
    const currentUserRef = this.userService.createRef(currentUser.id);
    const ownedCourses = await this.getCollection()
      .where('creator', '==', currentUserRef)
      .get();

    const participantCourses = await this.getCollection()
      .where('participants', 'array-contains', currentUserRef)
      .get();

    // create a separate query for each OR condition and merge the query results in your app.
    return {
      ownerOf: await this.getData(ownedCourses),
      participantOf: await this.getData(participantCourses),
    };
  }

}
