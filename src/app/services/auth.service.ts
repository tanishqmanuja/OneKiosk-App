import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

export interface AuthData {
  enroll: string;
  dob: string;
  pass: string;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  reason?: string;
}

const FAILED_AUTH_RESPONSE: AuthResponse = {
  isAuthenticated: false,
  reason: 'unknown',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authData: AuthData;
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.get('auth').then((authData) => {
      if (authData) this.authData = authData;
    });
    // this.authData = {
    //   enroll: '17802006',
    //   dob: '18/11/1998',
    //   pass: 'tm@02180530',
    // };
    // this.saveAuthData(this.authData);
  }

  getAuthData() {
    return this.authData;
  }

  async saveAuthData(authData: AuthData) {
    this.authData = authData;
    await this.storage.set('auth', authData);
  }

  async clearAuthData() {
    this.authData = null;
    await this.storage.remove('auth');
  }

  async login() {
    try {
      const res = (await this.http
        .get(this.apiUrl + '/login')
        .toPromise()) as AuthResponse;
      return res;
    } catch (error) {
      return FAILED_AUTH_RESPONSE;
    }
  }

  async logout() {
    try {
      const res = (await this.http
        .get(this.apiUrl + '/logout')
        .toPromise()) as AuthResponse;
      return res;
    } catch (error) {
      return FAILED_AUTH_RESPONSE;
    }
  }
}
