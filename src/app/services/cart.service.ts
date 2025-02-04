import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {CartResponseDTO} from '../dto/response/cart/CartResponseDTO';
import {HttpClient} from '@angular/common/http';
import {PurchasedProductRequestDTO} from '../dto/request/product/PurchasedProductRequestDTO';
import {PurchasedProductResponseDTO} from '../dto/response/cart/PurchasedProductResponseDTO';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/cart';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  findByUserId(): Observable<CartResponseDTO> {
    return this.http.get<CartResponseDTO>(`${this.baseUrl}/findByUserId`).pipe(
      map((response: CartResponseDTO) => {
        return response;
      }),
      catchError(error => this.handleError(error, 'recupero carrello'))
    )
  }

  removePurchasedProduct(productId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/removePurchasedProduct?id=${productId}`).pipe(
      map((response: boolean) => {
        return response;
      }),
      catchError(error => this.handleError(error, 'rimozione prodotto'))
    );
  }

  addToCart(purchasedProduct: PurchasedProductRequestDTO): Observable<PurchasedProductResponseDTO> {
    return this.http.post<PurchasedProductResponseDTO>(`${this.baseUrl}/addPurchasedProduct`, purchasedProduct).pipe(
      map((response: PurchasedProductResponseDTO) => {
        return response;
      }),
      catchError(error => this.handleError(error, 'aggiunta prodotto'))
    );
  }
}
