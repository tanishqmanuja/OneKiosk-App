import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { filter, map, switchMap, tap, throttleTime } from 'rxjs/operators';
import { days } from '../utilities/utilities';
import { StorageService } from './storage.service';

export type TimetableData = TimetableItem[];

export interface TimetableItem {
  day: string;
  time: number;
  type: Type;
  duration: string;
  batches?: string[];
  subject: Subject;
  venue?: string;
  teachers?: string[];
  sem?: string;
  degree?: string;
}

export interface Subject {
  name: string;
  acronym: string;
  coursecode?: string;
  refcode?: string;
}

export enum Type {
  Lecture = 'lecture',
  Practical = 'practical',
  Tutorial = 'tutorial',
}

export interface CurrentClasses {
  current: TimetableItem | undefined;
  upcoming: TimetableItem[] | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class TimetableService {
  private timetable = new BehaviorSubject<TimetableData>([]);
  private classesTimer = new BehaviorSubject(1 / 60);
  private currentClasses = new BehaviorSubject<CurrentClasses>({
    current: undefined,
    upcoming: undefined,
  });

  constructor(private storage: StorageService) {
    this.loadTimetable();
  }

  private async loadTimetable() {
    const timetable = await this.storage.get(this.storage.locations.timetable);

    if (timetable?.length > 0) {
      this.timetable.next(timetable);
      return;
    }
  }

  getTimetable() {
    return this.timetable.asObservable();
  }

  getCurrentClasses() {
    const calcCurrentClasses = () => {
      if (!this.timetable.value.length) return;

      const date = new Date();
      const day = date.getDay();
      const hr = date.getHours();
      const min = date.getMinutes();

      const classes = this.timetable.value
        .filter((item) => item.day === days[day])
        .sort((a, b) => a.time - b.time);

      const cc: CurrentClasses = {
        current: undefined,
        upcoming: undefined,
      };

      const currTimeIsLessThan = (h: number, m: number = 0) =>
        hr < h || (hr === h && min < m);
      const currTimeIsGreatorThan = (h: number, m: number = 0) =>
        hr > h || (hr === h && min > m);
      const currTimeIsBetween = (
        hmin: number,
        mmin: number = 0,
        hmax: number,
        mmax: number = 0
      ) => currTimeIsGreatorThan(hmin, mmin) && currTimeIsLessThan(hmax, mmax);

      if (currTimeIsGreatorThan(16, 50)) return cc;

      const foundIndex = classes.findIndex((item) =>
        currTimeIsBetween(
          item.time,
          0,
          item.time + parseInt(item.duration, 10) - 1,
          50
        )
      );
      if (foundIndex > 0) {
        cc.current = classes[foundIndex];
        cc.upcoming = classes.splice(foundIndex + 1);
      } else {
        cc.upcoming = classes.filter((item) => currTimeIsLessThan(item.time));
      }
      if (cc.upcoming.length === 0) cc.upcoming = undefined;

      return cc;
    };

    const calcDelayTime = () => {
      if (!this.timetable.value.length) return;

      const date = new Date();
      const hr = date.getHours();
      const min = date.getMinutes();

      const currTimeIsLessThan = (h: number, m: number = 0) =>
        hr < h || (hr === h && min < m);
      const currTimeIsGreatorThan = (h: number, m: number = 0) =>
        hr > h || (hr === h && min > m);
      const currTimeIsBetween = (
        hmin: number,
        mmin: number = 0,
        hmax: number,
        mmax: number = 0
      ) => currTimeIsGreatorThan(hmin, mmin) && currTimeIsLessThan(hmax, mmax);

      if (currTimeIsGreatorThan(16, 50)) return (24 - hr + 8) * 60;
      else if (currTimeIsLessThan(8)) return (8 - hr) * 60 + 60 - min;
      return 60 - min;
    };

    return this.classesTimer.pipe(
      switchMap((time) => interval(time * 60 * 1000)),
      throttleTime(500),
      map(() => calcCurrentClasses()),
      tap(() => {
        this.classesTimer.next(calcDelayTime());
      }),
      filter((c) => c?.current !== undefined || c?.upcoming !== undefined)
    );
  }

  async setTimetable(timetable: TimetableData) {
    this.timetable.next(timetable);
    await this.storage.set(this.storage.locations.timetable, timetable);
  }

  async updateClass(day: string, time: number, nData: TimetableItem) {
    const tt = this.timetable.value;
    const index = tt.findIndex(
      (item) => item.day === day && item.time === time
    );
    if (index > -1) {
      tt[index] = { ...tt[index], ...nData };
      this.setTimetable(tt);
    }
  }

  async addClass(nData: TimetableItem) {
    const tt = this.timetable.value;
    tt.push(nData);
    this.setTimetable(tt);
  }

  async removeClass(day: string, time: number) {
    let tt = this.timetable.value;
    tt = tt.filter((t) => !(t.day === day && t.time === time));
    this.setTimetable(tt);
  }
}
