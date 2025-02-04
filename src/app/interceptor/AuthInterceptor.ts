import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private errorUtils: ErrorUtils) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
        }

        this.handleHttpError(error, request.url);
        return throwError(() => error);
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse, context: string): void {
    this.errorUtils.showHttpError(error, context);
  }
}
