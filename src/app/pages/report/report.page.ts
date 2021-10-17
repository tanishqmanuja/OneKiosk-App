import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  PointsItem,
  ReportService,
  ReportsItem,
} from 'src/app/services/report.service';

import { UpdateService } from 'src/app/services/update.service';
import { animations } from './report.anim';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  animations,
})
export class ReportPage implements OnInit {
  selected$ = new BehaviorSubject(0);
  semcode: string = null;
  downloading = false;
  syncing = false;

  list$: Observable<string[]>;
  reports$: Observable<ReportsItem[]>;
  points$: Observable<PointsItem>;

  marksUpdatedOn: string;
  gradesUpdatedOn: string;
  pointsUpdatedOn: string;

  constructor(
    private reportService: ReportService,
    private updateService: UpdateService
  ) {}

  ngOnInit() {
    this.list$ = this.reportService.getMarksList();

    this.reports$ = combineLatest([
      this.getSemcode(),
      this.reportService.getReports(),
    ]).pipe(map(([semcode, rData]) => rData[semcode]));

    this.points$ = combineLatest([
      this.list$,
      this.selected$,
      this.reportService.getPoints(),
    ]).pipe(
      map(([list, selected, points]) => {
        const selectedSem =
          list.length - selected - (list.length - points.length);
        return points.find(
          (point) => parseInt(point.semester, 10) === selectedSem
        );
      })
    );
  }

  getSemcode() {
    return combineLatest([this.list$, this.selected$]).pipe(
      map(([list, selected]) => list[selected]),
      tap((semcode) => (this.semcode = semcode)),
      tap((semcode) => this.checkUpdatedOn())
    );
  }

  private checkUpdatedOn() {
    this.marksUpdatedOn = this.updateService.getUpdatedDateFor(
      'marks',
      this.semcode
    );
    this.gradesUpdatedOn = this.updateService.getUpdatedDateFor(
      'grades',
      this.semcode
    );
    this.pointsUpdatedOn = this.updateService.getUpdatedDateFor(
      'points',
      'all'
    );
  }

  percentage(x: any, y: any) {
    return (100 * parseInt(x, 10)) / parseInt(y, 10);
  }

  async changeSem(event: number) {
    if (event < 0) {
      this.syncing = true;
      await this.reportService.updateMarksList();
      this.syncing = false;
      return;
    }
    this.selected$.next(event);
    this.checkUpdatedOn();
  }

  async fetchSemData() {
    this.downloading = true;
    if (!this.semcode) {
      await Promise.all([
        this.reportService.updateMarksList(),
        this.reportService.updateGradesList(),
        this.reportService.updatePoints(),
      ]);
    }
    await this.reportService.updateReports(this.semcode);
    this.downloading = false;
    this.checkUpdatedOn();
  }

  async doRefresh(event: any) {
    if (this.selected$.value === 0) await this.reportService.updatePoints();
    await this.reportService.updateReports(this.semcode);
    this.checkUpdatedOn();
    event.target.complete();
  }
}
