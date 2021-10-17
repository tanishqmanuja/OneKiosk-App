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
      query('app-timetable-card:enter', style({ opacity: 0 }), {
        optional: true,
      }),

      query(
        'app-timetable-card:enter',
        stagger(
          '100ms',
          animate(
            '300ms 150ms ease-out',
            keyframes([
              style({ opacity: 0, transform: 'translateY(80px)', offset: 0 }),
              style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
            ])
          )
        ),
        { optional: true }
      ),
    ]),
  ]),
  trigger('daySelector', [
    transition('* => *', [
      query('.selected,.prev,.next', style({ opacity: 0 }), {
        optional: true,
      }),
      query(
        '.selected',
        animate(
          '300ms ease-in-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-40px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
          ])
        ),
        { optional: true }
      ),
      query(
        '.prev',
        animate(
          '150ms 100ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateX(10px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
          ])
        ),
        { optional: true }
      ),
      query(
        '.next',
        animate(
          '150ms 100ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateX(-10px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
          ])
        ),
        { optional: true }
      ),
    ]),
  ]),
];
