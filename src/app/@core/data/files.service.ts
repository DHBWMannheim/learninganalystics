import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { Observable } from 'rxjs';
import { CommonFirestoreService } from './common-firestore.service';

import { last, shareReplay } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { CommonFirestoreDocument } from './common-firestore-document';
import { Course, CoursesService } from './course.service';

export interface FireFile extends CommonFirestoreDocument {
  filename: string;
  path: string;
  course: DocumentReference<Course>;
}

export interface UploadQueueEntry extends FireFile {
  uploadProgress: Observable<number>;
}

@Injectable({ providedIn: 'root' })
export class FilesService extends CommonFirestoreService<FireFile> {
  constructor(
    firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
    private readonly coursesService: CoursesService,
  ) {
    super('files', firestore);
  }

  async upload(
    fileEntry: FileSystemFileEntry,
    courseId: string,
  ): Promise<UploadQueueEntry> {
    const file = await this.getFile(fileEntry);
    const id = this.getCollection().doc().id;
    const firebasePath = 'files/' + id;

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
        course: this.coursesService.createRef(courseId),
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
