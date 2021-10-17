import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Endpoints } from '../pages/settings/apis/apis.page';
import { StorageService } from '../services/storage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.handle(request, next));
  }

  async handle(request: HttpRequest<unknown>, next: HttpHandler) {
    const endpoints: Endpoints = await this.storage.get(
      this.storage.locations.endpoints
    );
    if (endpoints?.custom && endpoints?.primary && endpoints?.secondary) {
      let newUrl = '';
      if (request.url.includes(environment.apiUrl))
        newUrl = request.url.replace(environment.apiUrl, endpoints.primary);
      else if (request.url.includes(environment.apiUrlSecondary))
        newUrl = request.url.replace(environment.apiUrl, endpoints.secondary);

      if (newUrl) {
        const dupReq = request.clone({ url: newUrl });
        return next.handle(dupReq).toPromise();
      }
    }

    return next.handle(request).toPromise();
  }
}
