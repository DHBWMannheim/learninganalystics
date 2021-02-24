import {
  AngularFirestore,
  DocumentData,
  SnapshotOptions,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentReference,
} from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-firestore-document';

interface Converter<T> {
  toFirestore(u: T): DocumentData;
  fromFirestore(
    snapshot: QueryDocumentSnapshot<any>,
    options: SnapshotOptions,
  ): T;
}

export const CommonConverter = {
  // TODO: keine anys verwenden
  toFirestore(u: any): DocumentData {
    const { id, ...data } = u;
    for (const key in data) {
      if (data[key] === undefined) {
        delete data[key];
      }
    }
    return {
      ...data,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<any>,
    options: SnapshotOptions,
  ): any {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    };
  },
};

export abstract class CommonFirestoreService<
  T extends CommonFirestoreDocument
> {
  // TODO: das alles reaktiv mit subscriptions machen
  constructor(
    private readonly collectionName: string,
    private readonly afs: AngularFirestore,
    private readonly converter: Converter<T> = CommonConverter,
  ) {}

  // TODO: subscriptions?
  public async get(): Promise<T[]>;
  public async get(id: string): Promise<T>;
  public async get(id?: string): Promise<T | T[]> {
    if (id) {
      const idResult = await this.createRef(id).get();
      return idResult.data();
    }
    const snap = await this.getCollection().get();
    return this.getData(snap);
  }

  public async upsert(unit: T) {
    return unit.id
      ? this.createRef(unit.id).set(unit)
      : this.getCollection().add(unit);
  }

  public getCollection() {
    return this.afs
      .collection<T>(this.collectionName)
      .ref.withConverter(this.converter);
  }

  public createRef(id: string): DocumentReference<T> {
    return this.getCollection().doc(id); // TODO: stimmen die Typen?
  }

  public async getData(snapshot: QuerySnapshot<T> | Promise<QuerySnapshot<T>>) {
    const snap = await snapshot;
    return await Promise.all(
      snap.docs.map((doc) => {
        const data = doc.data() as any; //TODO: Fix for dates
        for (const field in data) {
          if (data[field].toDate) data[field] = data[field].toDate();
        }
        return data;
      }),
    );
  }

  public async exists(id: string) {
    const doc = await this.getCollection().doc(id).get();
    return doc.exists;
  }

  public async delete(id: string) {
    return this.createRef(id).delete();
  }
}
