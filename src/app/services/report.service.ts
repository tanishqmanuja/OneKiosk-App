import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';
import { UpdateService } from './update.service';

export interface MarksData {
  [key: string]: MarksItem[];
}

export interface MarksItem {
  course: Course;
  marks: Marks;
}

export interface Course {
  name: string;
  code: string;
}

export interface Marks {
  [key: string]: string;
}

export interface GradesData {
  [key: string]: GradesItem[];
}

export interface GradesItem {
  name: string;
  code: string;
  grade: string;
}

export type PointsData = PointsItem[];

export interface PointsItem {
  semester: string;
  credits: string;
  sgpa: string;
  cgpa: string;
}

export interface ReportsData {
  [key: string]: ReportsItem[];
}

export interface ReportsItem {
  course: Course;
  marks: Marks;
  grade?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private marksUrl = environment.apiUrl + '/marks';
  private marks = new BehaviorSubject<MarksData>({});
  private marksList = new BehaviorSubject<string[]>([]);

  private gradesUrl: string = environment.apiUrl + '/grades';
  private grades = new BehaviorSubject<GradesData>({});
  private gradesList = new BehaviorSubject<string[]>([]);

  private pointsUrl = environment.apiUrl + '/points';
  private points = new BehaviorSubject<PointsData>([]);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private updateService: UpdateService
  ) {
    this.init();
  }

  private async initMarks() {
    const list = await this.storage.get(this.storage.locations.list.marks);
    if (list && list.length) {
      this.marksList.next(list);
    }

    const marks = await this.storage.get(this.storage.locations.marks);
    if (marks) {
      this.marks.next(marks);
    }
  }

  private async initGrades() {
    const list = await this.storage.get(this.storage.locations.list.grades);
    if (list && list.length) {
      this.gradesList.next(list);
    }

    const grades = await this.storage.get(this.storage.locations.grades);
    if (grades) {
      this.grades.next(grades);
    }
  }

  private async initPoints() {
    const points = await this.storage.get(this.storage.locations.points);
    if (points && points.length) {
      this.points.next(points);
    }
  }

  private async init() {
    await this.initMarks();
    await this.initGrades();
    await this.initPoints();
  }

  getMarksList() {
    return this.marksList
      .asObservable()
      .pipe(filter((list) => list.length > 0));
  }

  getGradesList() {
    return this.gradesList
      .asObservable()
      .pipe(filter((list) => list.length > 0));
  }

  async updateMarksList() {
    try {
      const res: any = await this.http.get(this.marksUrl + '/list').toPromise();
      if (res.list && res.list.length) {
        this.marksList.next(res.list);
        await this.storage.set(
          this.storage.locations.list.marks,
          this.marksList.value
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateGradesList() {
    try {
      const res: any = await this.http
        .get(this.gradesUrl + '/list')
        .toPromise();
      if (res.list && res.list.length) {
        this.gradesList.next(res.list);
        await this.storage.set(
          this.storage.locations.list.grades,
          this.gradesList.value
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  getMarks() {
    return this.marks
      .asObservable()
      .pipe(filter((marks) => Object.keys(marks).length > 0));
  }

  getGrades() {
    return this.grades.asObservable();
  }

  getPoints() {
    return this.points
      .asObservable()
      .pipe(filter((points) => points.length > 0));
  }

  getReports() {
    return combineLatest([this.marks, this.grades]).pipe(
      map(([mData, gData]) => {
        // deep cloning mData to rData
        const rData: ReportsData = cloneDeep(mData);
        for (const [semcode, rItems] of Object.entries(rData)) {
          if (gData[semcode])
            rItems.forEach((rItem, index) => {
              const g = gData[semcode].filter(
                (v) => v.code === rItem.course.code
              );
              if (g.length && g[0].grade)
                rData[semcode][index].grade = g[0].grade;
            });
        }
        return rData;
      })
    );
  }

  async updateMarks(semcode: string) {
    if (
      !(this.marksList.value.length && this.marksList.value.includes(semcode))
    )
      return;
    try {
      const res: any = await this.http
        .get(`${this.marksUrl}/${semcode}`)
        .toPromise();
      if (res.data && res.data.length) {
        const marks = this.marks.value;
        marks[semcode] = res.data;
        this.marks.next(marks);
        await this.updateService.registerUpdateFor('marks', semcode);
        await this.storage.set(this.storage.locations.marks, this.marks.value);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async updateGrades(semcode: string) {
    if (
      !(this.gradesList.value.length && this.gradesList.value.includes(semcode))
    )
      return;
    try {
      const res: any = await this.http
        .get(`${this.gradesUrl}/${semcode}`)
        .toPromise();
      if (res.data && res.data.length) {
        const grades = this.grades.value;
        grades[semcode] = res.data;
        this.grades.next(grades);
        await this.updateService.registerUpdateFor('grades', semcode);
        await this.storage.set(
          this.storage.locations.grades,
          this.grades.value
        );
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async updateReports(semcode: string) {
    const [m, g] = await Promise.all([
      this.updateMarks(semcode),
      this.updateGrades(semcode),
    ]);
    return m && g;
  }

  async updatePoints() {
    try {
      const res: any = await this.http
        .get(this.pointsUrl)
        .pipe(timeout(15 * 1000))
        .toPromise();
      if (res.data && res.data.length) {
        this.points.next(res.data);
        await this.updateService.registerUpdateFor('points', 'all');
        await this.storage.set(
          this.storage.locations.points,
          this.points.value
        );
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
