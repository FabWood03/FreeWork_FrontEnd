import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {TicketResponseDTO} from '../dto/response/ticket/TicketResponseDTO';
import {TicketFilterRequest} from '../dto/request/ticket/TicketFilterRequest';
import {TicketRequestDTO} from '../dto/request/ticket/TicketRequestDTO';
import {ErrorUtils} from '../util/ErrorUtils';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:8080/api/ticket';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  getTicketById(ticketId: number): Observable<TicketResponseDTO> {
    return this.http.get<TicketResponseDTO>(`${this.apiUrl}/getTicketById`, {
      params: {id: ticketId}
    }).pipe(
      catchError((error) => this.handleError(error, 'caricamento del ticket'))
    );
  }

  getAllTickets(): Observable<TicketResponseDTO[]> {
    return this.http.get<TicketResponseDTO[]>(`${this.apiUrl}/getAll`).pipe(
      catchError((error) => this.handleError(error, 'caricamento dei ticket'))
    );
  }

  getPendingTickets(): Observable<TicketResponseDTO[]> {
    return this.http.get<TicketResponseDTO[]>(`${this.apiUrl}/getPendingTickets`).pipe(
      catchError((error) => this.handleError(error, 'caricamento dei ticket in sospeso'))
    );
  }

  getResolvedTickets(): Observable<TicketResponseDTO[]> {
    return this.http.get<TicketResponseDTO[]>(`${this.apiUrl}/getResolvedTickets`).pipe(
      catchError((error) => this.handleError(error, 'caricamento dei ticket risolti'))
    );
  }

  getTakeOnTickets(): Observable<TicketResponseDTO[]> {
    return this.http.get<TicketResponseDTO[]>(`${this.apiUrl}/getTakeOnTickets`).pipe(
      catchError((error) => this.handleError(error, 'caricamento dei ticket presi in carico'))
    );
  }

  getFilteredTickets(filterRequest: TicketFilterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/filter`, filterRequest).pipe(
      map(response => {
        return {
          allTickets: response.allTickets || [],
          pendingTickets: response.pendingTickets || [],
          resolvedTickets: response.resolvedTickets || [],
          takeOnTickets: response.takeOnTickets || []
        };
      }),
      catchError(error => {
        this.handleError(error, 'filtro dei ticket');
        return of({
          allTickets: [],
          pendingTickets: [],
          resolvedTickets: [],
          takeOnTickets: []
        });
      })
    );
  }

  changeTakeOnState(id: number) {
    return this.http
      .post<TicketResponseDTO>(`${this.apiUrl}/takeOnTicket`, null, {
        params: {id: id.toString()}
      })
      .pipe(
        catchError((error) => this.handleError(error, 'errore durante la presa in carico del ticket'))
      );
  }

  acceptTicket(id: number, ticketDescription: string) {
    return this.http.post(`${this.apiUrl}/acceptTicket`, null, {
      params: {id: id, description: ticketDescription}
    }).pipe(
      catchError((error) => this.handleError(error, 'errore durante l\'accettazione del ticket'))
    );
  }

  refuseTicket(id: number, ticketDescription: string) {
    return this.http.post(`${this.apiUrl}/refuseTicket`, null, {
      params: {id: id, description: ticketDescription}
    }).pipe(
      catchError((error) => this.handleError(error, 'errore durante il rifiuto del ticket'))
    );
  }

  reportReview(ticketRequestDTO: TicketRequestDTO) {
    return this.http.post(`${this.apiUrl}/reportReviews`, ticketRequestDTO).pipe(
      catchError((error) => this.handleError(error, 'errore durante la segnalazione della recensione'))
    );
  }

  reportProduct(ticketRequestDTO: TicketRequestDTO) {
    return this.http.post(`${this.apiUrl}/reportProduct`, ticketRequestDTO).pipe(
      catchError((error) => this.handleError(error, 'errore durante la segnalazione del prodotto'))
    );
  }

  reportUser(ticketRequestDTO: TicketRequestDTO) {
    return this.http.post(`${this.apiUrl}/reportUser`, ticketRequestDTO).pipe(
      catchError((error) => this.handleError(error, 'errore durante la segnalazione dell\'utente'))
    );
  }

  submitSellerRequest(formData: FormData) {
    return this.http.post(`${this.apiUrl}/sellerRequest`, formData).pipe(
      catchError((error) => this.handleError(error, 'errore durante la richiesta di venditore'))
    );
  }
}
