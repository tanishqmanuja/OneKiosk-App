import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { UpdateService } from './update.service';

export interface SubjectsData {
  [key: string]: SubjectsItem[];
}

export interface SubjectsItem {
  name: string;
  code: string;
  grade: string;
  type: string;
  credits: string;
  faculty?: Faculty;
}

interface Faculty {
  lecture?: string;
  tutorial?: string;
  practical?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private subjectsUrl: string = environment.apiUrl + '/subjects';
  private list: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private subjects: BehaviorSubject<SubjectsData> =
    new BehaviorSubject<SubjectsData>({});

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private updateService: UpdateService
  ) {
    this.init();
  }

  private async init() {
    const list = await this.storage.get(this.storage.locations.list.subjects);
    if (list && list.length) {
      this.list.next(list);
    }

    const subjects = await this.storage.get(this.storage.locations.subjects);
    if (subjects) {
      this.subjects.next(subjects);
    }
  }

  getList() {
    return this.list.asObservable().pipe(filter((list) => list.length > 0));
  }

  async updateList() {
    try {
      const res: any = await this.http
        .get(this.subjectsUrl + '/list')
        .toPromise();
      if (res.list && res.list.length) {
        this.list.next(res.list);
        await this.storage.set(
          this.storage.locations.list.subjects,
          this.list.value
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  getSubjects() {
    return this.subjects
      .asObservable()
      .pipe(filter((subjects) => Object.keys(subjects).length > 0));
  }

  async updateSubjects(semcode: string) {
    if (!(this.list.value.length && this.list.value.includes(semcode))) return;

    try {
      const res: any = await this.http
        .get(`${this.subjectsUrl}/${semcode}`)
        .toPromise();

      if (res.data && res.data.length) {
        const subjects = this.subjects.value;
        subjects[semcode] = res.data;
        this.subjects.next(subjects);
        await this.updateService.registerUpdateFor('subjects', semcode);
        await this.storage.set(
          this.storage.locations.subjects,
          this.subjects.value
        );
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
