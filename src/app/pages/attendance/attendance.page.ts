import { Component, OnInit } from '@angular/core';
import {
  AttendanceItem,
  AttendanceService,
} from 'src/app/services/attendance.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UpdateService } from 'src/app/services/update.service';
import { animations } from './attendance.anim';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
  animations,
})
export class AttendancePage implements OnInit {
  selected$ = new BehaviorSubject(0);
  semcode: string = null;
  downloading = false;
  syncing = false;

  list$: Observable<string[]>;
  attendance$: Observable<AttendanceItem[]>;

  updatedOn: string;

  constructor(
    private attendanceService: AttendanceService,
    private updateService: UpdateService
  ) {}

  ngOnInit() {
    this.list$ = this.attendanceService.getList();

    this.attendance$ = combineLatest([
      this.getSemcode(),
      this.attendanceService.getAttendance(),
    ]).pipe(map(([semcode, aData]) => aData[semcode]));
  }

  getSemcode() {
    return combineLatest([this.list$, this.selected$]).pipe(
      map(([list, selected]) => list[selected]),
      tap((semcode) => (this.semcode = semcode)),
      tap(
        (semcode) =>
          (this.updatedOn = this.updateService.getUpdatedDateFor(
            'attendance',
            semcode
          ))
      )
    );
  }

  async changeSem(event: number) {
    if (event < 0) {
      this.syncing = true;
      await this.attendanceService.updateList();
      this.syncing = false;
      return;
    }
    this.selected$.next(event);
  }

  async fetchSemData() {
    this.downloading = true;
    if (!this.semcode) {
      await this.attendanceService.updateList();
    }
    await this.attendanceService.updateAttendance(this.semcode);
    this.downloading = false;
    this.updatedOn = this.updateService.getUpdatedDateFor(
      'attendance',
      this.semcode
    );
  }

  async doRefresh(event: any) {
    await this.attendanceService.updateAttendance(this.semcode);
    this.updatedOn = this.updateService.getUpdatedDateFor(
      'attendance',
      this.semcode
    );
    event.target.complete();
  }
}
