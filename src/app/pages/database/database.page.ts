import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AttendanceData,
  AttendanceService,
} from 'src/app/services/attendance.service';
import { ReportsData, ReportService } from 'src/app/services/report.service';
import {
  SubjectsData,
  SubjectsService,
} from 'src/app/services/subjects.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
})
export class DatabasePage implements OnInit {
  attendance$: Observable<AttendanceData>;
  reports$: Observable<ReportsData>;
  subjects$: Observable<SubjectsData>;
  aList$: Observable<string[]>;
  mList$: Observable<string[]>;
  sList$: Observable<string[]>;

  downloadingA = false;
  downloadingB = false;
  downloadingC = false;

  constructor(
    private attendanceService: AttendanceService,
    private reportService: ReportService,
    private subjectsService: SubjectsService
  ) {}

  ngOnInit() {
    this.aList$ = this.attendanceService.getList();
    this.mList$ = this.reportService.getMarksList();
    this.sList$ = this.subjectsService.getList();
    this.attendance$ = this.attendanceService.getAttendance();
    this.reports$ = this.reportService.getReports();
    this.subjects$ = this.subjectsService.getSubjects();
  }

  aIsAvailableForSem$(semcode: string) {
    return this.attendance$.pipe(map((attendance) => !!attendance[semcode]));
  }

  rIsAvailableForSem$(semcode: string) {
    return this.reports$.pipe(map((reports) => !!reports[semcode]));
  }

  sIsAvailableForSem$(semcode: string) {
    return this.subjects$.pipe(map((subjects) => !!subjects[semcode]));
  }

  getIcon(el: HTMLElement) {
    if (el.classList.contains('loading')) return 'sync-outline';
    else if (el.classList.contains('negative')) return 'close-outline';
    return 'checkmark-outline';
  }

  async updateAttendance(semcode: string, el: HTMLElement) {
    el.classList.add('loading');
    await this.attendanceService.updateAttendance(semcode);
    el.classList.remove('loading');
  }

  async updateReports(semcode: string, el: HTMLElement) {
    el.classList.add('loading');
    await this.reportService.updateReports(semcode);
    el.classList.remove('loading');
  }

  async updateSubjects(semcode: string, el: HTMLElement) {
    el.classList.add('loading');
    await this.subjectsService.updateSubjects(semcode);
    el.classList.remove('loading');
  }

  async fetchAList() {
    this.downloadingA = true;
    await this.attendanceService.updateList();
    this.downloadingA = false;
  }

  async fetchMList() {
    this.downloadingB = true;
    await this.reportService.updateMarksList();
    this.downloadingB = false;
  }

  async fetchSList() {
    this.downloadingC = true;
    await this.subjectsService.updateList();
    this.downloadingC = false;
  }
}
