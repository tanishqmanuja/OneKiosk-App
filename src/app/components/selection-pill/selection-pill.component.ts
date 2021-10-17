import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-selection-pill',
  templateUrl: './selection-pill.component.html',
  styleUrls: ['./selection-pill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionPillComponent implements OnInit {
  @Input() options = ['Lecture', 'Tutorial', 'Total'];
  @Input() selected = 0;
  @Output() selectionChanged = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  changeSelected(index: number) {
    this.selected = index;
    this.selectionChanged.emit(index);
  }
}
