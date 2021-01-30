import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CommonFirestoreDocument } from './common-document.interface';
import { CommonFirestoreService } from './common-firestore.service';

const KEY_LENGTH = 6; // Ich denke 6 zeichen reichen 26^6 ist schon ein bisl was, ist es besser wenn weniger/mehr?
const KEY_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export interface Course extends CommonFirestoreDocument {
  key?: string; // TODO:?
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService extends CommonFirestoreService<Course> {
  constructor(firestore: AngularFirestore) {
    super('courses', firestore);
  }

  public async upsert(unit: Course) {
    if (unit.id) return this.createRef(unit.id).set(unit);

    let generatedKey; // TODO: Gibt es einen besseren weg?
    do {
      generatedKey = this.generatePseudoUniqueKey();
    } while (await this.isKeyTaken(generatedKey));
    unit.key = generatedKey;

    return this.getCollection().add(unit);
  }

  private async isKeyTaken(key: string) {
    const dup = await this.getCollection()
      .where('key', '==', key)
      .limit(1)
      .get();
    return dup.docs.some((doc) => doc.exists);
  }

  private generatePseudoUniqueKey() {
    let result = '';
    for (let i = 0; i < KEY_LENGTH; i++)
      result += KEY_ALPHABET.charAt(
        Math.floor(Math.random() * KEY_ALPHABET.length),
      );

    return result;
  }
}
