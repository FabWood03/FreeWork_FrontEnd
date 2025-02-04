import {Injectable} from '@angular/core';
import {OfferResponseDTO} from '../dto/response/auction/OfferResponseDTO';
import {catchError, Observable, throwError} from 'rxjs';
import {OfferRequestDTO} from '../dto/request/auction/OfferRequestDTO';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseUrl = 'http://localhost:8080/api/offer';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  createOffer(offerRequestDTO: OfferRequestDTO): Observable<OfferResponseDTO> {
    return this.http
      .post<OfferResponseDTO>(`${this.baseUrl}/create`, offerRequestDTO)
      .pipe(
        catchError((error) => this.handleError(error, 'creazione dell\'offerta'))
      );
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token'); // Adatta a seconda di dove memorizzi il token
  }

  getPersonalOffer(auctionId: number): Observable<OfferResponseDTO> {
    const token = this.getAuthToken();

    // Aggiungi l'header con il token se disponibile
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<OfferResponseDTO>(`${this.baseUrl}/getOfferByUser`, {
      headers: headers,
      params: {auctionId: auctionId.toString()}
    })
      .pipe(
        catchError((error) => this.handleError(error, 'caricamento dell\'offerta personale'))
      );
  }

  getOffersByAuctionId(auctionId: number): Observable<OfferResponseDTO[]> {
    return this.http
      .get<OfferResponseDTO[]>(`${this.baseUrl}/getOffersByAuctionId`, {
        params: {auctionId: auctionId.toString()},
      })
      .pipe(
        catchError((error) => this.handleError(error, 'caricamento delle offerte'))
      );
  }

  deleteOffer(auctionId: number) {
    return this.http.delete<boolean>(`${this.baseUrl}/delete?auctionId=${auctionId}`);
  }

  updateOffer(offerRequest: OfferRequestDTO): Observable<OfferResponseDTO> {
    return this.http.patch<OfferResponseDTO>(`${this.baseUrl}/update`, offerRequest).pipe(
      catchError((error) => this.handleError(error, 'modifica dell\'offerta'))
    );
  }
}
