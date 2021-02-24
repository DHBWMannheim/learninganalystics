import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { IndexCard, IndexCardsService } from '../../../@core/data/index-cards.service';
import { EditComponent } from '../edit/edit.component';
import { TinderChoice } from '../tinder-ui/tinder-ui.component';

@Component({
  selector: 'ngx-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {
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

  constructor(
    private readonly dialogService: NbDialogService,
    private readonly indexCardsService: IndexCardsService,
  ) {}

  @Input('cards')
  cards: IndexCard[];

  roundFinished: boolean = false;
  private courseId: string;

  private originalCardCount: number;
  private known: number = 0;
  private notKnown: number = 0;

  ngOnInit(): void {
  }

  async logChoice({ choice, payload }: TinderChoice) {
    choice ? this.known++ : this.notKnown++; // TODO: besser als array und am schluss eine übersicht über nicht gewusste Fragen
    
    if (choice) {
      // start streak
      await this.indexCardsService.upsert({
        ...payload,
        streak: payload.streak + 1,
        streakSince: payload.streak ? payload.streakSince : Date.now()
      });
    } else {
      // end streak
      await this.indexCardsService.upsert({
        ...payload,
        streak: 0,
        streakSince: 0
      });
    }

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

  repeat() {
    this.roundFinished = false;
    this.known = 0;
    this.notKnown = 0;
    // this.reload()
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
        // await this.reload();
      });
  }

  delete(card: IndexCard) {
    this.dialogService
      .open(EditComponent, {
        context: {
          courseId: this.courseId,
          card
        },
      })
      .onClose.subscribe(async () => {
        // await this.reload();
      });
  }

}
