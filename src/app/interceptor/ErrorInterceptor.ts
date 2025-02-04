import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorUtils: ErrorUtils) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleHttpError(error, request.url);
        return throwError(() => error);
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse, context: string): void {
    this.errorUtils.showHttpError(error, context);
  }
}
