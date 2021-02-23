import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CoursesService } from '../../@core/data/course.service';
import { IndexCard, IndexCardsService } from '../../@core/data/index-cards.service';
import { fade } from '../../@theme/animations/fade.animation';
import { AddComponent } from './add/add.component';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { TinderChoice } from './tinder-ui/tinder-ui.component';

@Component({
  selector: 'ngx-index-cards',
  templateUrl: './index-cards.component.html',
  styleUrls: ['./index-cards.component.scss'],
  animations: [fade(200)], // TODO: Die Animation noch anpassen
})
export class IndexCardsComponent implements OnInit {
  cards = [];

  private courseId: string;
  isLecturer: boolean;
  loadingCards: boolean = true;
  roundFinished: boolean = false;

  cardStreaks: any = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  };

  private calculateCardStreaks(): void {
    this.cardStreaks = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: []
    };

    this.cards.forEach(card => {
      if (card.streak) {
        const now = Date.now();
  
        if (card.streak === 1 && now - card.streakSince > 60 * 24 * 60 * 60 * 1000) {
          this.cardStreaks[6].push(card)
        } else if (card.streak === 1 && now - card.streakSince > 30 * 24 * 60 * 60 * 1000) {
          this.cardStreaks[5].push(card)
        } else if (card.streak === 1 && now - card.streakSince > 10 * 24 * 60 * 60 * 1000) {
          this.cardStreaks[4].push(card)
        } else if (card.streak === 1 && now - card.streakSince > 2 * 24 * 60 * 60 * 1000) {
          this.cardStreaks[3].push(card)
        } else if (card.streak === 1 && now - card.streakSince > 24 * 60 * 60 * 1000) {
          this.cardStreaks[2].push(card)
        } else if (card.streak === 1 && now - card.streakSince > 20 * 60 * 1000) {
          this.cardStreaks[1].push(card)
        }
      }
      this.cardStreaks[0].push(card)
    })
  }

  constructor(
    private readonly dialogService: NbDialogService,
    private readonly indexCardsService: IndexCardsService,
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      this.isLecturer = await this.coursesService.isLecturer(courseId);
      await this.reload();
    });
  }

  async reload() {
    this.loadingCards = true;
    const cards = await this.indexCardsService.getData(
      await this.indexCardsService
        .getCollection()
        .where('course', '==', this.coursesService.createRef(this.courseId))
        .get(),
    );
    this.cards = cards;
    this.loadingCards = false;
    this.calculateCardStreaks();
  }

  openAddDialog() {
    this.dialogService
      .open(AddComponent, {
        context: {
          courseId: this.courseId,
        },
      })
      .onClose.subscribe(async () => {
        await this.reload();
      });
  }

}
