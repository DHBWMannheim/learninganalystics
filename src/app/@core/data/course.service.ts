import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, share, skipWhile, take } from 'rxjs/operators';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';
import { User, UserService } from './user.service';

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
    private readonly toastr: NbToastrService,
    private readonly translate: TranslateService,
    private readonly auth: NbAuthService,
  ) {
    super('courses', firestore);
    this.auth.onAuthenticationChange().subscribe((s) => {
      if (!s) {
        this._currentCourses.next({
          creations: [],
          participations: [],
        });
      } else {
        this.refreshCourses();
      }
    });
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
    this.toastr.success(
      await this.translate.get('join.toast.created.message').toPromise(),
      await this.translate.get('join.toast.created.title').toPromise(),
    );
    await this.refreshCourses();
    return document.id;
  }

  async joinCourse(key: string): Promise<string | undefined> {
    const relevant = await this.getCollection()
      .where('key', '==', key.toLowerCase())
      .limit(1)
      .get();

    const doc = relevant.docs[0];
    if (!doc) {
      this.toastr.danger('There is no course with this key', 'Not Found');
      return;
    }
    const course = doc.data();

    const currentUser = await this.userService.currentUser;

    if (
      course.creator.id === currentUser.id ||
      course.participants.some((p) => p.id === currentUser.id)
    ) {
      this.toastr.danger(
        await this.translate.get('join.toast.conflict.message').toPromise(),
        await this.translate.get('join.toast.conflict.title').toPromise(),
      );
      return;
    }

    course.participants.push(this.userService.createRef(currentUser.id));

    await this.upsert(course);
    this.toastr.success(
      await this.translate.get('join.toast.joined.message').toPromise(),
      await this.translate.get('join.toast.joined.title').toPromise(),
    );
    await this.refreshCourses();
    return course.id;
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

  get currentCourses(): Observable<RelevantCourses> {
    return this._currentCourses.pipe(
      map(({ creations, participations }) => ({
        creations: creations.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
        ),
        participations: participations.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
        ),
      })),
    );
  }
  async isLecturer(course: string | Course): Promise<boolean> {
    const user = await this.userService.currentUser;
    if (typeof course === 'string') {
      const dbCourse = await this.get(course);
      return dbCourse.creator.id === user.id;
    }
    return course.creator.id === user.id;
  }

  async leaveCourse(course: Course) {
    const user = await this.userService.currentUser;
    const dbCourse = await this.get(course.id);
    dbCourse.creator =
      dbCourse.creator.id === user.id ? null : dbCourse.creator;
    dbCourse.participants = dbCourse.participants.filter(
      (part) => part.id !== user.id,
    );
    await this.upsert(dbCourse);

    const { creations, participations } = await this.currentCourses
      .pipe(take(1))
      .toPromise();
    this._currentCourses.next({
      creations: creations.filter(({ id }) => id !== course.id),
      participations: participations.filter(({ id }) => id !== course.id),
    });
  }
}
