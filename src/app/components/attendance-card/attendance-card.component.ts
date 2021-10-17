import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AttendanceItem } from 'src/app/services/attendance.service';
import { titleShortener } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-attendance-card',
  templateUrl: './attendance-card.component.html',
  styleUrls: ['./attendance-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceCardComponent {
  @Input() data: AttendanceItem;

  constructor() {}

  get dots() {
    return this.data.details
      .slice(0, 5)
      .map((detail) => detail.status === 'Present');
  }

  dotColor(val: boolean) {
    return val ? 'var(--clr-a1)' : 'var(--clr-a2)';
  }

  pillColor(val: number) {
    if (val > 60) {
      return 'var(--clr-a1)';
    }
    return 'var(--clr-a2)';
  }

  get title() {
    return titleShortener(this.data.course.name, 14);
  }

  get total(): number {
    return (
      parseInt(this.data.attendance.total, 10) ||
      parseInt(this.data.attendance.practical, 10)
    );
  }

  get valid(): boolean {
    return this.data && Object.keys(this.data.attendance).length > 0;
  }
}
