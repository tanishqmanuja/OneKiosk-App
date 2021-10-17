import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { UpdateService } from './update.service';

export interface FeesItem {
  semester: string;
  currency: string;
  amount: string;
  discount: string;
  paid: string;
  dues: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  private feesUrl: string = environment.apiUrl;
  private fees = new BehaviorSubject<FeesItem[]>([]);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private updateService: UpdateService
  ) {
    this.init();
  }

  private async init() {
    const fees = await this.storage.get(this.storage.locations.fees);
    if (fees && fees.length) {
      this.fees.next(fees);
    }
  }

  getFees() {
    return this.fees.asObservable().pipe(filter((fees) => fees.length > 0));
  }

  async updateFees() {
    try {
      const res: any = await this.http.get(this.feesUrl + '/fees').toPromise();
      if (res.data && res.data.length) {
        this.fees.next(res.data);
        await this.updateService.registerUpdateFor('fees', 'all');
        await this.storage.set(this.storage.locations.fees, this.fees.value);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
