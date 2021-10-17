import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import {
  trigger,
  style,
  animate,
  transition,
  stagger,
  query,
  keyframes,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-sem-select-bar',
  templateUrl: './sem-select-bar.component.html',
  styleUrls: ['./sem-select-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('list', [
      transition(':enter', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(
            '80ms',
            animate(
              '320ms ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateX(80px)', offset: 0 }),
                style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
              ])
            )
          ),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class SemSelectBarComponent {
  selected = 0;

  @Input() list = [];
  @Input() syncing = false;
  @Output() semChange = new EventEmitter<number>();

  slideOpts = {
    initialSlide: 1,
    resistanceRatio: 0.4,
    slidesPerView: 3.4,
    slidesOffsetBefore: 13,
    speed: 400,
  };

  constructor() {}

  async changeActive(index: number) {
    if (index >= 0) {
      this.selected = index;
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
    this.semChange.emit(index);
  }
}
