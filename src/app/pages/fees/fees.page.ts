import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FeesItem, FeesService } from 'src/app/services/fees.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.page.html',
  styleUrls: ['./fees.page.scss'],
  animations: [
    trigger('list', [
      transition('*=>*', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(
            '150ms',
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
  ],
})
export class FeesPage implements OnInit {
  parseInt = (x: any) => parseInt(x, 10);
  downloading = false;
  fees$: Observable<FeesItem[]>;

  constructor(private feesService: FeesService) {}

  ngOnInit() {
    this.fees$ = this.feesService.getFees();
  }

  /* Thanks to https://stackoverflow.com/users/87015/salman-a
   for https://stackoverflow.com/a/9462382 */

  parseMoney(amount: any, digits: number) {
    const num = parseInt(amount, 10);

    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e5, symbol: 'L' },
      { value: 1e7, symbol: 'Cr' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find((n) => num >= n.value);
    return item
      ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
      : '0';
  }

  netPaid(fees: FeesItem[]) {
    return fees.reduce((sum, item) => sum + parseInt(item.paid, 10), 0);
  }

  netDues(fees: FeesItem[]) {
    return fees.reduce((sum, item) => sum + parseInt(item.dues, 10), 0);
  }

  async fetchData() {
    this.downloading = true;
    await this.feesService.updateFees();
    this.downloading = false;
  }

  async doRefresh(event: any) {
    await this.feesService.updateFees();
    event.target.complete();
  }
}
