import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { IndexCard } from '../../../@core/data/index-cards.service';

import { fade } from '../../../@theme/animations/fade.animation';

export interface TinderChoice {
  choice: boolean;
  payload: IndexCard;
}

@Component({
  selector: 'tinder-ui',
  templateUrl: 'tinder-ui.component.html',
  styleUrls: ['tinder-ui.component.scss'],
  animations: [fade(200)],
})
export class TinderUIComponent implements AfterViewInit {
  @Input('cards')
  cards: IndexCard[];

  @ViewChildren('tinderCard', { read: ElementRef })
  tinderCards: QueryList<ElementRef>;

  tinderCardsArray: ElementRef[];

  @Output()
  choiceMade = new EventEmitter<TinderChoice>();

  moveOutWidth: number;
  shiftRequired: boolean;
  transitionInProgress: boolean;
  heartVisible: boolean;
  crossVisible: boolean;

  crossCount = 0;
  heartCount = 0;

  fadeState = 'in';

  constructor(private readonly renderer: Renderer2) {}

  userClickedButton(event: Event, heart: boolean) {
    event.preventDefault();
    if (!this.cards.length) return false;
    if (heart) {
      this.renderer.setStyle(
        this.tinderCardsArray[0].nativeElement,
        'transform',
        `translate(${this.moveOutWidth}px,-100px) rotate(-30deg)`,
      );
    } else {
      this.renderer.setStyle(
        this.tinderCardsArray[0].nativeElement,
        'transform',
        `translate(-${this.moveOutWidth}px,-100px) rotate(30deg)`,
      );
    }
    this.toggleChoiceIndicator(!heart, heart);
    this.emitChoice(heart, this.cards[0]);
    this.shiftRequired = true;
    this.transitionInProgress = true;
  }

  handlePan(event) {
    if (
      event.deltaX === 0 ||
      (event.center.x === 0 && event.center.y === 0) ||
      !this.cards.length
    )
      return;

    if (this.transitionInProgress) {
      this.handleShift();
    }

    this.renderer.addClass(this.tinderCardsArray[0].nativeElement, 'moving');

    if (event.deltaX > 0) {
      this.toggleChoiceIndicator(false, true);
    }
    if (event.deltaX < 0) {
      this.toggleChoiceIndicator(true, false);
    }

    const xMulti = event.deltaX * 0.03;
    const yMulti = event.deltaY / 80;
    const rotate = xMulti * yMulti;

    this.renderer.setStyle(
      this.tinderCardsArray[0].nativeElement,
      'transform',
      `translate(${event.deltaX}px,${event.deltaY}px) rotate(${rotate}deg)`,
    );

    this.shiftRequired = true;
  }

  handlePanEnd(event) {
    this.toggleChoiceIndicator(false, false);

    if (!this.cards.length) return;

    this.renderer.removeClass(this.tinderCardsArray[0].nativeElement, 'moving');

    const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
    if (keep) {
      this.renderer.setStyle(
        this.tinderCardsArray[0].nativeElement,
        'transform',
        '',
      );
      this.shiftRequired = false;
    } else {
      const endX = Math.max(
        Math.abs(event.velocityX) * this.moveOutWidth,
        this.moveOutWidth,
      );
      const toX = event.deltaX > 0 ? endX : -endX;
      const endY = Math.abs(event.velocityY) * this.moveOutWidth;
      const toY = event.deltaY > 0 ? endY : -endY;
      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;

      this.renderer.setStyle(
        this.tinderCardsArray[0].nativeElement,
        'transform',
        `translate(${toX}px,${toY + event.deltaY}px) rotate(${rotate}deg)`,
      );

      this.shiftRequired = true;

      this.emitChoice(!!(event.deltaX > 0), this.cards[0]);
    }
    this.transitionInProgress = true;
  }

  toggleChoiceIndicator(cross: boolean, heart: boolean) {
    this.crossVisible = cross;
    this.heartVisible = heart;
  }

  handleShift() {
    this.transitionInProgress = false;
    this.toggleChoiceIndicator(false, false);
    if (this.shiftRequired) {
      this.shiftRequired = false;
      this.cards.shift();
      if (!this.cards.length) this.fadeState = 'out';
    }
  }

  emitChoice(heart: boolean, card: IndexCard) {
    if (this.transitionInProgress) return;
    heart ? this.heartCount++ : this.crossCount++;
    this.choiceMade.emit({
      choice: heart,
      payload: card,
    });
  }

  ngAfterViewInit() {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.tinderCardsArray = this.tinderCards.toArray();
    this.tinderCards.changes.subscribe(() => {
      this.tinderCardsArray = this.tinderCards.toArray();
    });
  }
}
