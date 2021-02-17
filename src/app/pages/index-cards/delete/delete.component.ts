import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CoursesService } from '../../../@core/data/course.service';
import { IndexCard, IndexCardsService } from '../../../@core/data/index-cards.service';

@Component({
  selector: 'ngx-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {

  courseId: string;
  card: IndexCard;

  constructor(
    private readonly dialogRef: NbDialogRef<DeleteComponent>,
    private readonly indexCardsService: IndexCardsService,
    private readonly toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.indexCardsService.delete(this.card.id);
    this.toastrService.show('Index card deleted', 'Success!', {
      status: 'success',
    });
    this.close();
  }
}
