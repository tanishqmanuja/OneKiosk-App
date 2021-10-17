import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FacultyData = FacultyItem[];

export interface FacultyItem {
  department: Department;
  code: string;
  name: string;
  url?: string;
  imgUrl?: string;
  position?: string;
}

export enum Department {
  Biotech = 'BIOTECH',
  CSEIt = 'CSE & IT',
  Ece = 'ECE',
  Hss = 'HSS',
  Maths = 'MATHS',
  Physics = 'PHYSICS',
}

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private data = new BehaviorSubject<FacultyData>([]);

  constructor(private http: HttpClient) {
    this.loadFaculty();
  }

  private loadFaculty() {
    this.http
      .get('assets/data/faculty.json')
      .pipe()
      .subscribe(
        (res) => {
          this.data.next(res as FacultyData);
        },
        () => {
          alert('failed loading json data');
        }
      );
  }

  getFaculty() {
    return this.data.asObservable();
  }
}
