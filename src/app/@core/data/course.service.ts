export const TEMP_COURSE_ID = 'q0uYGbRT8H5zmxwHKS3t';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';

export interface Course extends CommonFirestoreDocument {
  name: string;
  key: string;
}

@Injectable({ providedIn: 'root' })
export class CoursesService extends CommonFirestoreService<Course> {
  constructor(firestore: AngularFirestore) {
    super('courses', firestore);
  }

  get currentCourse(): Observable<Course> { // TODO: Einschreiben
    return of({
      name: 'WWI18-SEA/C - Verteilte Systeme',
      key: 'woo-opy-key',
    }).pipe(share());
  }
}
