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
  gaugeState = 'out';

  echartOptions = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 16,
        },
        axisLine: {
          lineStyle: {
            width: 16,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          length: 8,
          lineStyle: {
            width: 2,
            color: '#999',
          },
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 16,
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: {
            borderWidth: 2,
          },
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          fontSize: 46,
          offsetCenter: [0, '50%'],
        },
        data: [
          {
            value: 0,
          },
        ],
      },
    ],
  };
  cards = [];

  private courseId: string;
  isLecturer: boolean;
  loadingCards: boolean = true;
  roundFinished: boolean = false;

  private originalCardCount: number;
  private known: number = 0;
  private notKnown: number = 0;

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
    this.originalCardCount = cards.length;
    this.loadingCards = false;
  }

  logChoice({ choice }: TinderChoice) {
    choice ? this.known++ : this.notKnown++; // TODO: besser als array und am schluss eine übersicht über nicht gewusste Fragen
    if (this.known + this.notKnown === this.originalCardCount) {
      setTimeout(() => {
        this.echartOptions.series[0].data[0].value = Math.round(
          (this.known / (this.notKnown + this.known)) * 100,
        );
        this.echartOptions = { ...this.echartOptions }; // TODO: use merge
        this.gaugeState = 'in';
      }, 200);
      this.roundFinished = true;
    }
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

  repeat() {
    this.roundFinished = false;
    this.known = 0;
    this.notKnown = 0;
    this.reload()
  }

  edit(card: IndexCard) {
    this.dialogService
      .open(EditComponent, {
        context: {
          courseId: this.courseId,
          card
        },
      })
      .onClose.subscribe(async () => {
        await this.reload();
      });
  }

  delete(card: IndexCard) {
    this.dialogService
      .open(DeleteComponent, {
        context: {
          courseId: this.courseId,
          card
        },
      })
      .onClose.subscribe(async () => {
        await this.reload();
      });
  }
}
