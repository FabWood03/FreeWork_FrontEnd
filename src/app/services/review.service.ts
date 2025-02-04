import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ReviewSummaryResponse} from '../dto/response/review/ReviewSummaryResponse';
import {ReviewPagination} from '../dto/response/review/ReviewPagination';
import {ErrorUtils} from '../util/ErrorUtils';
import {ReviewRequestDTO} from '../dto/request/review/ReviewRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = 'http://localhost:8080/api/reviews';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  getReviewsByProductId(productId: number, page: number, size: number): Observable<ReviewPagination> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ReviewPagination>(`${this.apiUrl}/findByProductId`, {params}).pipe(
      map((response: ReviewPagination) => response),
      catchError(error => this.handleError(error, 'caricamento recensioni per prodotto'))
    );
  }

  getReviewSummaryByProductId(productId: number): Observable<ReviewSummaryResponse> {
    const params = new HttpParams().set('productId', productId.toString());
    return this.http.get<ReviewSummaryResponse>(`${this.apiUrl}/reviewSummaryByProductId`, {params});
  }

  getReviewSummaryByUserId(userId: number): Observable<ReviewSummaryResponse> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<ReviewSummaryResponse>(`${this.apiUrl}/reviewSummaryByUserId`, {params});
  }

  getReviewsReceivedByUserId(userId: number) {
    const params = new HttpParams()
      .set('userId', userId)

    return this.http.get<any>(`${this.apiUrl}/getReviewsReceivedByUserId`, {params}).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() =>
          new Error('Errore nel caricamento delle recensioni: ' + (error.message || 'Si è verificato un errore sconosciuto'))
        );
      })
    );
  }

  getReviewsByUserId(userId: number) {
    const params = new HttpParams()
      .set('userId', userId)

    return this.http.get<any>(`${this.apiUrl}/getReviewsByUserId`, {params}).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() =>
          new Error('Errore nel caricamento delle recensioni: ' + (error.message || 'Si è verificato un errore sconosciuto'))
        );
      })
    );
  }

  createReview(review: ReviewRequestDTO, reviewImages: File[]) {
    const formData = new FormData();
    formData.append('reviewRequestDTO', new Blob([JSON.stringify(review)], {type: 'application/json'}));

    reviewImages.forEach((file) => {
      formData.append('images', file, file.name);
    });

    return this.http.post<any>(`${this.apiUrl}/create`, formData).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() =>
          new Error('Errore durante la creazione della recensione: ' + (error.message || 'Si è verificato un errore sconosciuto'))
        );
      })
    );
  }
}
