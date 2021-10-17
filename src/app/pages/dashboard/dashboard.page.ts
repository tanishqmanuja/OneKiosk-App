import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import {
  Attendance,
  AttendanceItem,
  AttendanceService,
} from 'src/app/services/attendance.service';
import {
  Marks,
  MarksItem,
  ReportService,
} from 'src/app/services/report.service';
import {
  CurrentClasses,
  TimetableService,
} from 'src/app/services/timetable.service';
import { titleShortener } from 'src/app/utilities/utilities';
import { animations } from './dashbaord.anim';

type AttendanceMarksItem = AttendanceItem & Partial<MarksItem>;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  animations,
})
export class DashboardPage implements OnInit {
  tShort = titleShortener;

  am$: Observable<AttendanceMarksItem[]>;
  classes$: Observable<CurrentClasses>;
  totalMarks$ = new BehaviorSubject(0.1);
  totalAttendance$ = new BehaviorSubject(0.1);

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.9,
    slidesOffsetBefore: 28,
    slidesOffsetAfter: 28,
    spaceBetween: 12,
  };

  constructor(
    private timetableService: TimetableService,
    private attendanceService: AttendanceService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.am$ = combineLatest([
      this.attendanceService.getList(),
      this.attendanceService.getAttendance(),
      this.reportService.getMarks().pipe(startWith([])),
    ]).pipe(
      map(([list, attendance, marks]) => {
        if (!marks[list[0]]) return attendance[list[0]];
        const m = marks[list[0]];
        const am = attendance[list[0]] as AttendanceMarksItem[];
        am.forEach((item, index) => {
          const found = m.find(
            (mi: MarksItem) => mi.course.code === item.course.code
          );
          if (found) am[index].marks = found.marks;
        });
        am.push(
          ...m.filter(
            (mi: MarksItem) =>
              !am.find((ami) => ami.course.code === mi.course.code)
          )
        );
        return am;
      }),
      tap((am: AttendanceMarksItem[]) => {
        const totalAttendance =
          am
            .filter((item) => this.mapAttendance(item.attendance))
            .reduce(
              (acc, item) => acc + this.mapAttendance(item.attendance),
              0
            ) / am.filter((item) => this.mapAttendance(item.attendance)).length;
        const totalMarks =
          am
            .filter((item) => this.mapMarks(item.marks))
            .reduce((acc, item) => acc + this.mapMarks(item.marks), 0) /
          am.filter((item) => this.mapMarks(item.marks)).length;
        if (totalAttendance) this.totalAttendance$.next(totalAttendance);
        if (totalMarks) this.totalMarks$.next(totalMarks);
      })
    );

    this.classes$ = this.timetableService.getCurrentClasses();
  }

  mapAttendance(attendance: Attendance) {
    if (!attendance.total && !attendance.practical) return null;
    return parseInt(attendance.total, 10) || parseInt(attendance.practical, 10);
  }

  mapMarks(marks: Marks) {
    if (!marks) return null;
    const maxMarks = (str: string) =>
      parseInt(
        str.substring(str.lastIndexOf('(') + 1, str.lastIndexOf(')')),
        10
      );

    const summer = (a: number, b: number) => a + b;
    const sum = Object.values(marks)
      .map((x) => parseInt(x, 10))
      .reduce(summer);
    const max = Object.keys(marks).map(maxMarks).reduce(summer);
    return Math.floor((100 * sum) / max);
  }

  formatTime(time: number) {
    if (time < 12) return time + ' am';
    if (time > 12) return time - 12 + ' pm';
    return time + ' pm';
  }
}
