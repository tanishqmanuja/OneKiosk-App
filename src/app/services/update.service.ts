import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface UpdateData {
  attendance?: UpdatedOnWithSem;
  marks?: UpdatedOnWithSem;
  grades?: UpdatedOnWithSem;
  subjects?: UpdatedOnWithSem;
  points?: UpdatedOnWithoutSem;
  fees?: UpdatedOnWithoutSem;
}

export interface UpdatedOnWithSem {
  [key: string]: UpdatedOn;
}

export interface UpdatedOnWithoutSem {
  all: UpdatedOn;
}

export interface UpdatedOn {
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private update: UpdateData = {
    attendance: {},
    marks: {},
    grades: {},
    subjects: {},
    points: { all: { date: null } },
    fees: { all: { date: null } },
  };

  constructor(private storage: StorageService) {
    this.init();
  }

  private async init() {
    const update = await this.storage.get(this.storage.locations.update);
    if (update) this.update = update;
  }

  async registerUpdateFor(name: keyof UpdateData, sem: string) {
    if (sem in this.update[name]) {
      this.update[name][sem].date = new Date();
    } else {
      this.update[name][sem] = { date: new Date() };
    }
    await this.storage.set(this.storage.locations.update, this.update);
  }

  getUpdatedDateFor(name: keyof UpdateData, sem?: string) {
    if (sem) return this.update[name][sem]?.date?.toString();
    return;
  }
}
