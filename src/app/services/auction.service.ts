import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {AuctionDetailsDTO} from '../dto/response/auction/AuctionDetailsDTO';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuctionSummaryDTO} from '../dto/response/auction/AuctionSummary';
import {AuctionRequestDTO} from '../dto/request/auction/AuctionRequestDTO';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private baseUrl = 'http://localhost:8080/api/auction';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  listActiveAuctions(): Observable<AuctionSummaryDTO[]> {
    return this.http.get<AuctionSummaryDTO[]>(`${this.baseUrl}/auctionActiveSummary`).pipe(
      map((response: AuctionSummaryDTO[]) => response),
      catchError(error => this.handleError(error, 'caricamento delle aste attive'))
    );
  }

  listActiveAndPendingAuctionsByUserId(userId: number): Observable<AuctionSummaryDTO[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<AuctionSummaryDTO[]>(`${this.baseUrl}/summaryByUserId`, {params}).pipe(
      map((response: AuctionSummaryDTO[]) => response),
      catchError(error => this.handleError(error, 'caricamento delle aste attive per utente'))
    );
  }

  getAuctionDetails(auctionId: number): Observable<AuctionDetailsDTO> {
    const params = new HttpParams().set('auctionId', auctionId.toString());
    return this.http.get<AuctionDetailsDTO>(`${this.baseUrl}/details`, {params}).pipe(
      map((response: AuctionDetailsDTO) => response),
      catchError(error => this.handleError(error, 'caricamento dei dettagli dell\'asta'))
    );
  }

  listPendingAuctions(): Observable<AuctionSummaryDTO[]> {
    return this.http.get<AuctionSummaryDTO[]>(`${this.baseUrl}/auctionPendingSummary`).pipe(
      map((response: AuctionSummaryDTO[]) => response),
      catchError(error => this.handleError(error, 'caricamento delle aste in attesa'))
    );
  }

  subscribeUserAuction(id: number): Observable<void> {
    const params = new HttpParams().set('auctionId', id.toString());
    return this.http.post<void>(`${this.baseUrl}/subscribeUserNotification`, null, {params}).pipe(
      catchError(error => this.handleError(error, 'sottoscrizione all\'asta'))
    );
  }

  createAuction(auction: AuctionRequestDTO): Observable<AuctionDetailsDTO> {
    return this.http.post<AuctionDetailsDTO>(`${this.baseUrl}/create`, auction).pipe(
      map((response: AuctionDetailsDTO) => response),
      catchError(error => this.handleError(error, 'creazione dell\'asta'))
    );
  }

  getClosedAuctionsByUser(): Observable<AuctionSummaryDTO[]> {
    return this.http.get<AuctionSummaryDTO[]>(`${this.baseUrl}/getClosedAuctionsByUser`);
  }

  assignWinner(auctionId: number, winnerId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('auctionId', auctionId.toString())
      .set('winnerId', winnerId.toString());

    return this.http.post<boolean>(`${this.baseUrl}/assignWinner`, null, {params});
  }

  getPendingAuctionsByUser() {
    return this.http.get<AuctionSummaryDTO[]>(`${this.baseUrl}/getPendingAuctionsByUser`);
  }

  getOpenAuctionsByUser() {
    return this.http.get<AuctionSummaryDTO[]>(`${this.baseUrl}/getOpenAuctionsByUser`);
  }

  deleteAuction(auctionId: number) {
    const params = new HttpParams().set('auctionId', auctionId.toString());
    return this.http.delete(`${this.baseUrl}/delete`, {params}).pipe(
      catchError(error => this.handleError(error, 'eliminazione dell\'asta'))
    );
  }

  updateAuction(auctionRequest: AuctionRequestDTO): Observable<AuctionDetailsDTO> {
    return this.http.patch<AuctionDetailsDTO>(`${this.baseUrl}/update`, auctionRequest).pipe(
      catchError(error => this.handleError(error, 'aggiornamento dell\'asta'))
    );
  }
}
