import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { Observable } from 'rxjs';
import { CommonFirestoreService } from './common-firestore.service';

import { last, shareReplay } from 'rxjs/operators';
import { v4 } from 'uuid';
import { AngularFireStorage } from '@angular/fire/storage';
import { CommonFirestoreDocument } from './common-firestore-document';

export interface FireFile extends CommonFirestoreDocument{
  id: string;
  filename: string;
  path: string;
  // TODO: Kurs, user
}

export interface UploadQueueEntry extends FireFile {
  uploadProgress: Observable<number>;
}

@Injectable({ providedIn: 'root' })
export class FilesService extends CommonFirestoreService<FireFile> {
  constructor(
    firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
  ) {
    super('files', firestore);
  }

  async upload(fileEntry: FileSystemFileEntry): Promise<UploadQueueEntry> {
    const file = await this.getFile(fileEntry);
    const firebasePath = 'files/' + v4();
    const id = this.getCollection().doc().id;

    const dto = {
      id,
      filename: fileEntry.name,
      uploadProgress: this.fireStorage
        .upload(firebasePath, file, {
          contentDisposition: 'attachment; filename=' + fileEntry.name, // TODO: Muss der speziell encoded/escaped werden sein?
        })
        .percentageChanges()
        .pipe(shareReplay(1)),
      path: firebasePath,
    } as UploadQueueEntry;

    dto.uploadProgress.pipe(last()).subscribe((_) =>
      this.upsert({
        id,
        path: firebasePath,
        filename: fileEntry.name,
      } as FireFile),
    );
    return dto;
  }

  private getFile(val: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve) => {
      val.file((file) => {
        resolve(file);
      });
    });
  }

  async deleteWithStorage(file: FireFile) {
    await this.delete(file.id);
    await this.fireStorage.ref(file.path).delete().toPromise();
  }

  async download(file: FireFile) {
    const url = await this.fireStorage
      .ref(file.path)
      .getDownloadURL()
      .toPromise();
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    a.click();
  }
}
