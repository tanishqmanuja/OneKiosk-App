import {
  trigger,
  style,
  animate,
  transition,
  stagger,
  query,
  keyframes,
} from '@angular/animations';

export const animations = [
  trigger('slide', [
    transition(':enter', [
      query('ion-slide', style({ opacity: 0 }), { optional: true }),
      query(
        'ion-slide',
        stagger(
          '100ms',
          animate(
            '350ms 220ms ease-out',
            keyframes([
              style({
                opacity: 0,
                transform: 'translateX(180px)',
                offset: 0,
              }),
              style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
            ])
          )
        ),
        { optional: true }
      ),
    ]),
  ]),
  trigger('card', [
    transition(':enter', [
      query('.class-card', style({ opacity: 0 }), { optional: true }),
      query(
        '.class-card',
        stagger(
          '100ms',
          animate(
            '300ms 220ms ease-out',
            keyframes([
              style({
                opacity: 0,
                transform: 'translateY(60px)',
                offset: 0,
              }),
              style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
            ])
          )
        ),
        { optional: true }
      ),
    ]),
  ]),
];
