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
  trigger('list', [
    transition('*=>*', [
      query('app-report-card:enter', style({ opacity: 0 }), { optional: true }),
      query(
        'app-report-card:enter',
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
  trigger('bar', [
    transition(
      ':enter',
      animate(
        '500ms ease-out',
        keyframes([
          style({ width: '0', opacity: 0 }),
          style({ width: '*', opacity: 1 }),
        ])
      )
    ),
  ]),
];
