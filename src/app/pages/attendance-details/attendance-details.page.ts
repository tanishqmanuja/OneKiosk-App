import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AttendanceItem,
  AttendanceService,
  Detail,
} from 'src/app/services/attendance.service';
import { titleShortener } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.page.html',
  styleUrls: ['./attendance-details.page.scss'],
})
export class AttendanceDetailsPage implements OnInit {
  data$: Observable<AttendanceItem>;
  title: string;
  ltp$: Observable<string[]>;
  selected$: BehaviorSubject<number> = new BehaviorSubject(0);
  filteredList$: Observable<Detail[]>;

  constructor(
    private attendanceService: AttendanceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const attendance$ = this.attendanceService.getAttendance();
    const params$ = this.route.params;

    this.data$ = combineLatest([attendance$, params$]).pipe(
      map(
        ([attendance, params]) =>
          attendance[params.semcode].filter(
            (v) => v.course.code === params.coursecode
          )[0]
      ),
      tap((data) => {
        this.title = titleShortener(data.course.name, 14);
      })
    );

    this.ltp$ = this.data$.pipe(
      map((data) => {
        const uniqueLTP = data.details
          .map((d) => d.ltp)
          .filter((v, i, a) => a.indexOf(v) === i);
        if (uniqueLTP.length > 1) return ['Total', ...uniqueLTP];
        return uniqueLTP;
      })
    );

    this.filteredList$ = combineLatest([
      this.data$,
      this.ltp$,
      this.selected$,
    ]).pipe(
      map(([data, ltp, selected]) =>
        data.details.filter((d) => {
          if (selected > 0) return d.ltp === ltp[selected];
          return true;
        })
      )
    );
  }

  attendingNext(details: Detail[]): number {
    return Math.floor(
      ((details.filter((val) => val.status === 'Present').length + 1) * 100) /
        (details.length + 1)
    );
  }

  missingNext(details: Detail[]): number {
    return Math.floor(
      (details.filter((val) => val.status === 'Present').length * 100) /
        (details.length + 1)
    );
  }

  total(data: AttendanceItem): number {
    if (data.attendance.total) return parseInt(data.attendance.total, 10);
    return parseInt(data.attendance.practical, 10);
  }
}
