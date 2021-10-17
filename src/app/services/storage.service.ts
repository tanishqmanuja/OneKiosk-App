import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _locations = {
    auth: 'auth',
    attendance: 'attendance',
    marks: 'marks',
    grades: 'grades',
    points: 'points',
    fees: 'fees',
    subjects: 'subjects',
    timetable: 'timetable',
    list: {
      attendance: 'list_attendance',
      marks: 'list_marks',
      grades: 'list_grades',
      subjects: 'list_subjects',
    },
    theme: 'theme',
    update: 'update',
    endpoints: 'endpoints',
  };

  constructor() {}

  get locations() {
    return this._locations;
  }

  async get(key: string) {
    const res = await Storage.get({ key });
    const data = JSON.parse(res.value);
    return data;
  }

  async set(key: string, value: any) {
    await Storage.set({
      key,
      value: JSON.stringify(value),
    });
    return;
  }

  async remove(key: string) {
    await Storage.remove({ key });
  }
}
