import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import {OrderResponseDTO} from '../dto/response/OrderResponseDTO';
import {OrderFilterRequest} from '../dto/request/OrderFilterRequest';
import {FilteredOrdersResponse} from '../dto/response/FilteredOrdersResponse';
import {ErrorUtils} from '../util/ErrorUtils';

class OrderRequestDTO {
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/order';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  getOrderByUserId() {
    return this.http.get(`${this.apiUrl}/getOrderByUser`);
  }

  createOrder(orderRequestDTO: OrderRequestDTO): Observable<OrderResponseDTO> {
    return this.http.post<OrderResponseDTO>(`${this.apiUrl}/create`, orderRequestDTO).pipe(
      catchError((error) => this.handleError(error, 'creazione ordine'))
    );
  }

  getFilteredOrders(filterRequest: OrderFilterRequest): Observable<OrderResponseDTO[]> {
    return this.http.post<OrderResponseDTO[]>(`${this.apiUrl}/getFilteredOrders`, filterRequest).pipe(
      catchError((error) => this.handleError(error, 'recupero ordini filtrati'))
    );
  }

  getAllOrdersBySeller(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getReceivedOrdersBySeller`).pipe(
      catchError((error) => this.handleError(error, 'errore durante il recupero degli ordini del venditore'))
    );
  }

  getPendingOrdersBySeller(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getPendingOrdersBySeller`).pipe(
      catchError((error) => this.handleError(error, 'errore durante il recupero degli ordini in sospeso del venditore'))
    );
  }

  getTakeOnOrdersBySeller(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTakeOnOrdersBySeller`).pipe(
      catchError((error) => this.handleError(error, 'errore durante il recupero degli ordini in carico del venditore'))
    );
  }

  getDeliveredOrdersBySeller(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDeliveredOrdersBySeller`).pipe(
      catchError((error) => this.handleError(error, 'errore durante il recupero degli ordini consegnati del venditore'))
    );
  }

  getDelayedOrdersBySeller(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDelayedOrdersBySeller`).pipe(
      catchError((error) => this.handleError(error, 'errore durante il recupero degli ordini in ritardo del venditore'))
    );
  }

  getRefusedOrdersBySeller(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getRefusedOrdersBySeller`).pipe(
      catchError((error) => this.handleError(error, 'errore durante il recupero degli ordini rifiutati del venditore'))
    );
  }

  acceptOrder(orderProductId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/acceptSingleOrderProduct`, null, {params: {orderProductId: orderProductId}}).pipe(
      catchError((error) => this.handleError(error, 'Errore durante l\'accettazione del servizio dell\'ordine'))
    );
  }

  refuseOrder(orderProductId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/refuseSingleOrderProduct`, null, {params: {orderProductId: orderProductId}}).pipe(
      catchError((error) => this.handleError(error, 'Errore durante il rifiuto del servizio dell\'ordine'))
    );
  }

  getOrderProductById(productOrderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getOrderProductById`, {params: {orderProductId: productOrderId}}).pipe(
      catchError((error) => this.handleError(error, 'Errore durante il recupero del servizio dell\'ordine'))
    );
  }

  getFilteredOrdersBySeller(filterRequest: OrderFilterRequest): Observable<FilteredOrdersResponse> {
    return this.http.post<FilteredOrdersResponse>(`${this.apiUrl}/getFilteredOrdersBySeller`, filterRequest).pipe(
      catchError(error => {
        this.handleError(error, 'filtro degli ordini');
        return of({
          allOrders: [],
          refusedOrders: [],
          delayedOrders: [],
          deliveredOrders: [],
          pendingOrders: [],
          takeOnOrders: []
        });
      })
    );
  }

  deliveryResponse(orderProductId: number, deliveryResponse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deliveryResponse`, null, {
      params: {
        orderProductId: orderProductId,
        deliveryResponse: deliveryResponse
      }
    }).pipe(
      catchError((error) => this.handleError(error, 'Errore durante la risposta alla consegna'))
    );
  }
}
