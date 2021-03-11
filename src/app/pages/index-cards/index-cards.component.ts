import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CoursesService } from '../../@core/data/course.service';
import {
  IndexCard,
  IndexCardPersistence,
  IndexCardsService,
} from '../../@core/data/index-cards.service';
import {
  IndexCardStreak,
  StreakService,
} from '../../@core/data/streak.service';
import { AddComponent } from './add/add.component';

const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;
const TWENTY_MINUTES = 20 * 60 * 1000;
/**
 * 1. IndexCardCollection
 * 2. IndexCardProgess.where(indexCardId)
 * 3. zip(obs1,obs2)
 */

@Component({
  selector: 'ngx-index-cards',
  templateUrl: './index-cards.component.html',
  styleUrls: ['./index-cards.component.scss'],
})
export class IndexCardsComponent implements OnInit {
  private cards: IndexCard[] = [];
  courseId: string;

  isLecturer: boolean;
  loadingCards: boolean = true;

  cardStreaks = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  constructor(
    private readonly dialogService: NbDialogService,
    private readonly indexCardsService: IndexCardsService,
    private readonly route: ActivatedRoute,
    private readonly coursesService: CoursesService,
    private readonly streakService: StreakService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      this.isLecturer = await this.coursesService.isLecturer(courseId);
      await this.reload();
    });
  }

  private calculateCardStreaks(): void {
    this.cardStreaks = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    this.cards.forEach((card) => {
      if (card.streak) {
        const now = Date.now();

        if (card.streak === 6 && now - card.streakSince > SIXTY_DAYS) {
          this.cardStreaks[6].push(card);
        } else if (card.streak === 5 && now - card.streakSince > THIRTY_DAYS) {
          this.cardStreaks[5].push(card);
        } else if (card.streak === 4 && now - card.streakSince > TEN_DAYS) {
          this.cardStreaks[4].push(card);
        } else if (card.streak === 3 && now - card.streakSince > TWO_DAYS) {
          this.cardStreaks[3].push(card);
        } else if (card.streak === 2 && now - card.streakSince > ONE_DAY) {
          this.cardStreaks[2].push(card);
        } else if (
          card.streak === 1 &&
          now - card.streakSince > TWENTY_MINUTES
        ) {
          this.cardStreaks[1].push(card);
        }
      }
      this.cardStreaks[0].push(card);
    });
  }

  async reload() {
    this.loadingCards = true;
    const cards = (await this.indexCardsService.getData(
      await this.indexCardsService
        .getCollection()
        .where('course', '==', this.coursesService.createRef(this.courseId))
        .get(),
    )) as IndexCardPersistence[];

    const streaks = (await this.streakService.getChunked(
      cards.map((c) => this.indexCardsService.createRef(c.id)),
      (chunk) => {
        return this.streakService
          .getCollection()
          .where('indexCard', 'in', chunk)
          .get();
      },
      this.streakService.getData,
    )) as IndexCardStreak[];

    this.cards = cards.map((c) => {
      const ref = this.indexCardsService.createRef(c.id);
      const streak = streaks.find((s) => s.indexCard.id === ref.id);
      return {
        ...c,
        streak: streak?.streak ?? 0,
        streakSince: streak?.streakSince ?? 0,
        streakId: streak?.id ?? null,
      };
    });

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
