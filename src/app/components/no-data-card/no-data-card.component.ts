import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-no-data-card',
  templateUrl: './no-data-card.component.html',
  styleUrls: ['./no-data-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flyIn',[
      transition(':enter',animate('320ms ease-out',
        keyframes([
          style({transform: 'translateY(-20px)', opacity: 0}),
          style({transform: 'translateY(0px)', opacity: 1})
        ])
      )),
    ])
  ]
})
export class NoDataCardComponent {
  @Input() downloading = false;

  constructor() { }

}
