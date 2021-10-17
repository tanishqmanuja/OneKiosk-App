import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpInterceptor, HttpEvent } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

export const DEFAULT_RETRIES = new InjectionToken<number>('defaultRetries');

@Injectable({
  providedIn: 'root',
})
export class RetryInterceptor implements HttpInterceptor {
  constructor(@Inject(DEFAULT_RETRIES) protected defaultRetries: number) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(retry(this.defaultRetries));
  }
}
