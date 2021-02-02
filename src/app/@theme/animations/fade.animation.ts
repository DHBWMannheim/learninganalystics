import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fade = (duration: string|number = 100) =>
  trigger('fadeAnimation', [
    state('in', style({ opacity: 1 })),
    state('out', style({ opacity: 0 })),
    transition('*=>*', animate(duration)),
  ]);
