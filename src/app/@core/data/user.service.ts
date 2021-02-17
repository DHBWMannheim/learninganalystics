import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import {
  debounceTime,
  delayWhen,
  map,
  shareReplay,
  take,
} from 'rxjs/operators';

import { CommonFirestoreDocument } from './common-firestore-document';
import { CommonFirestoreService } from './common-firestore.service';

export interface User extends CommonFirestoreDocument {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends CommonFirestoreService<User> {
  private _userObservable: Observable<User | null>;

  constructor(
    firestore: AngularFirestore,
    private readonly firebaseAuth: AngularFireAuth,
  ) {
    super('users', firestore);

    this._userObservable = this.firebaseAuth.user.pipe(
      map(
        (user) =>
          user && {
            id: user.uid,
            email: user.email,
          },
      ),
      debounceTime(200),
      delayWhen((user) => from(this.upsert(user))),
      shareReplay(1),
    );
  }

  get userObservable() {
    return this._userObservable;
  }

  get currentUser() {
    return this.userObservable.pipe(take(1)).toPromise();
  }
}
