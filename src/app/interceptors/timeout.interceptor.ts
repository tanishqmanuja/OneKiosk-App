import { Injectable, InjectionToken, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, TimeoutError } from 'rxjs';
import { timeout, catchError, retry } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
export const DEFAULT_TIMEOUT_RETRIES = new InjectionToken<number>(
  'defaultTimeoutRetries'
);

@Injectable({
  providedIn: 'root',
})
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
    @Inject(DEFAULT_TIMEOUT_RETRIES) protected defaultTimeoutRetries: number
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modified = req.clone({
      setHeaders: { 'X-Request-Timeout': `${this.defaultTimeout}` },
    });

    return next.handle(modified).pipe(
      timeout(this.defaultTimeout),
      retry(this.defaultTimeoutRetries),
      catchError((err) => {
        if (err instanceof TimeoutError)
          console.error('Timeout has occurred', req.url);
        return EMPTY;
      })
    );
  }
}
