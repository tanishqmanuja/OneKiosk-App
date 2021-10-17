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
  trigger('cardsAnimation', [
    transition('* => *', [
      query('app-attendance-card:enter', style({ opacity: 0 }), {
        optional: true,
      }),
      query(
        'app-attendance-card:enter',
        stagger(
          '100ms',
          animate(
            '320ms ease-out',
            keyframes([
              style({
                opacity: 0,
                transform: 'translateY(-20px)',
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
