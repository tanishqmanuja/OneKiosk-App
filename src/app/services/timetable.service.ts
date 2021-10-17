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
  private classesTimer = new BehaviorSubject(0.2);

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

      const currTimeIsLessThan = (h: number) => hr < h;
      const currTimeIsGreatorThan = (h: number) => hr > h;
      const currTimeIsBetween = (h1: number, h2: number) =>
        hr >= h1 && hr < h2 && (hr === h2 - 1 ? min <= 50 : true);

      if (currTimeIsGreatorThan(17)) return cc;

      const foundIndex = classes.findIndex((item) =>
        currTimeIsBetween(item.time, item.time + parseInt(item.duration, 10))
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

      const currTimeIsGreatorThan = (h: number) => hr > h;

      if (currTimeIsGreatorThan(15)) return (24 - hr + 8) * 60 + 50;
      else if (currTimeIsGreatorThan(8)) return min >= 50 ? 60 - min : 50 - min;
      return (8 - hr) * 60 + 50;
    };

    return this.classesTimer.pipe(
      switchMap((time) => interval(time * 60 * 1000)),
      throttleTime(500),
      map(() => calcCurrentClasses()),
      tap((val) => {
        const delay = calcDelayTime();
        // console.log('classes', val);
        // console.log('delay', Math.floor(delay / 60), delay % 60);
        this.classesTimer.next(delay);
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
