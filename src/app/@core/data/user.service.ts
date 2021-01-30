import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, ReplaySubject } from 'rxjs';
import {
  debounceTime,
  delayWhen,
  map,
  shareReplay,
  take,
} from 'rxjs/operators';
import { CommonFirestoreDocument } from './common-document.interface';

import { CommonFirestoreService } from './common-firestore.service';

export interface User extends CommonFirestoreDocument {
  displayName?: string;
  email: string;
  emailVerified: boolean;
  photoURL?: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends CommonFirestoreService<User> {
  private _userObservable: Observable<User | null>; // TODO: muss das beim logout geleert werden?

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
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
          },
      ),
      debounceTime(200), // Das ist total unnötig, dachte aber es spart etwas firebase bandbreite, da beim login 2x gefeuert
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
