import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { UpdateService } from './update.service';

export interface AttendanceData {
  [key: string]: AttendanceItem[];
}

export interface AttendanceItem {
  course: Course;
  attendance: Attendance;
  details: Detail[];
}

export interface Attendance {
  total?: string;
  lecture?: string;
  tutorial?: string;
  practical?: string;
}

export interface Course {
  name: string;
  code: string;
}

export interface Detail {
  date: string;
  teacher: string;
  status: Status;
  type: string;
  ltp?: Ltp;
}

export enum Ltp {
  Lecture = 'Lecture',
  Tutorial = 'Tutorial',
  practical = 'Practical',
}

export enum Status {
  Absent = 'Absent',
  Present = 'Present',
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private attendanceUrl: string = environment.apiUrl + '/attendance';
  private attendanceUrlSecondary: string =
    environment.apiUrlSecondary + '/attendance';
  private list = new BehaviorSubject<string[]>([]);
  private attendance = new BehaviorSubject<AttendanceData>({});

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private updateService: UpdateService
  ) {
    this.init();
  }

  private async init() {
    const list = await this.storage.get(this.storage.locations.list.attendance);
    if (list && list.length) {
      this.list.next(list);
    }

    const attendance = await this.storage.get(
      this.storage.locations.attendance
    );
    if (attendance) {
      this.attendance.next(attendance);
    }
  }

  getList() {
    return this.list.asObservable().pipe(filter((list) => list.length > 0));
  }

  async updateList() {
    try {
      const res: any = await this.http
        .get(this.attendanceUrl + '/list')
        .toPromise();
      if (res.list && res.list.length) {
        this.list.next(res.list);
        await this.storage.set(
          this.storage.locations.list.attendance,
          this.list.value
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  getAttendance() {
    return this.attendance
      .asObservable()
      .pipe(filter((attendance) => Object.keys(attendance).length > 0));
  }

  async updateAttendance(semcode: string) {
    if (!(this.list.value.length && this.list.value.includes(semcode))) return;

    // Prefer Secondary URL for longer requests
    let attendanceUrl = this.attendanceUrl;
    if (environment.production) {
      attendanceUrl = this.attendanceUrlSecondary;
    }

    try {
      const res: any = await this.http
        .get(`${attendanceUrl}/detailed/${semcode}`)
        .toPromise();
      if (res?.data && res.data.length) {
        const attendance = this.attendance.value;
        attendance[semcode] = res.data;
        this.attendance.next(attendance);
        await this.updateService.registerUpdateFor('attendance', semcode);
        await this.storage.set(
          this.storage.locations.attendance,
          this.attendance.value
        );
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
