import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { last } from 'rxjs/operators';
import { CoursesService } from '../../@core/data/course.service';

import {
  FilesService,
  FireFile,
  UploadQueueEntry,
} from '../../@core/data/files.service';

declare const browser;

@Component({
  selector: 'ngx-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  files: FireFile[];
  courseId: string;
  isLecturer: boolean;

  constructor(
    private readonly filesService: FilesService,
    private readonly toastr: NbToastrService,
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      this.files = await this.filesService.getData(
        await this.filesService
          .getCollection()
          .where('course', '==', this.coursesService.createRef(this.courseId))
          .get(),
      );
      this.isLecturer = await this.coursesService.isLecturer(this.courseId);
    });
  }

  public fileUploadQueue: UploadQueueEntry[] = [];

  public async dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        const queueElement = await this.filesService.upload(
          fileEntry,
          this.courseId,
        );
        this.fileUploadQueue.push(queueElement);
        queueElement.uploadProgress.pipe(last()).subscribe((_) => {
          // TODO: Error handling?
          this.fileUploadQueue = this.fileUploadQueue.filter(
            (element) => element !== queueElement,
          );
          this.files.push(queueElement);
          this.toastr.show('Saved', 'Saved successfully', {
            status: 'success',
          });
        });
      }
    }
  }

  getStatus(value: number) {
    return value < 100 ? 'primary' : 'success';
  }

  async del(file: FireFile) {
    this.files = this.files.filter((element) => element !== file);
    await this.filesService.deleteWithStorage(file);
    this.toastr.show('Deleted', 'Deleted successfully', {
      status: 'success',
    });
  }

  async download(file: FireFile) {
    await this.filesService.download(file);
  }
}
