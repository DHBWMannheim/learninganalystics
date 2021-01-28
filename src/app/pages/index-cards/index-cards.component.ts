import { Component, OnInit } from '@angular/core';
import { fade } from '../../@theme/animations/fade.animation';
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
        // TODO:
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

  constructor() {}

  ngOnInit(): void {
    for (
      let i = 0;
      i < this.TEMP_TOTAL_CARDS;
      i++ //TODO: Max 20, 10 ist optimum
    )
      this.cards.push({
        title: 'Demo',
        description: 'Descript',
      });
  }

  private readonly TEMP_TOTAL_CARDS = 20;
  private known = 0;
  private notKnown = 0;
  logChoice({ choice }: TinderChoice) {
    choice ? this.known++ : this.notKnown++; // TODO: besser als array und am schluss eine übersicht über nicht gewusste Fragen
    if (this.known + this.notKnown === this.TEMP_TOTAL_CARDS) {
      setTimeout(() => {
        this.echartOptions.series[0].data[0].value = Math.round(
          (this.known / (this.notKnown + this.known)) * 100,
        );
        this.echartOptions = { ...this.echartOptions }; // TODO: use merge
        this.gaugeState = 'in';
      }, 200);
    }
  }
}
