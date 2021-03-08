import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import {
  IndexCard,
  IndexCardsService,
} from '../../../@core/data/index-cards.service';

@Component({
  selector: 'ngx-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  courseId: string;
  card: IndexCard;

  constructor(
    private readonly dialogRef: NbDialogRef<DeleteComponent>,
    private readonly indexCardsService: IndexCardsService,
    private readonly toastrService: NbToastrService,
    private readonly translate: TranslateService,
  ) {}

  close() {
    this.dialogRef.close();
  }

  async submit() {
    await this.indexCardsService.delete(this.card.id);
    this.toastrService.success(
      await this.translate.get('indexCards.delete.toast.deleted.message').toPromise(),
      await this.translate.get('indexCards.delete.toast.deleted.title').toPromise(),
    );
    this.close();
  }
}
