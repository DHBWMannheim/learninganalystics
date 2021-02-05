import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';

import { v4 } from 'uuid';

@Component({
  selector: 'ngx-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  constructor(
    private readonly fireStorage: AngularFireStorage,
    private readonly fireStore: AngularFirestore,
  ) {}

  ngOnInit(): void {}

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        // Here you can access the real file
        console.log(droppedFile.relativePath, file);
        const path = 'uploads/' + v4();
        this.fireStorage.upload(path, file);
        this.fireStore.collection('TEMPFILES').add({ path });
      });
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  getStatus(value: number) {
    return value <= 25
      ? 'danger'
      : value <= 50
      ? 'warning'
      : value <= 75
      ? 'info'
      : 'success';
  }
}
