import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const auth = this.authService.getAuthData();

    if (auth) {
      const authString = JSON.stringify(auth);
      const authBase64 = btoa(authString);

      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${authBase64}`,
        },
      });
    }

    return next.handle(request);
  }
}
