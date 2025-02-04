import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ProductDetailsDTO} from '../dto/response/product/ProductDetailsDTO';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductSummaryDTO} from '../dto/response/product/ProductSummaryDTO';
import {TagResponseDTO} from '../dto/response/product/TagResponseDTO';
import {ProductRequestDTO} from '../dto/request/product/ProductRequestDTO';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';


  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  getAllProductSummary(): Observable<ProductSummaryDTO[]> {
    return this.http.get<ProductSummaryDTO[]>(`${this.apiUrl}/summary`).pipe(
      map((response: ProductSummaryDTO[]) => {
        return response;
      }),
      catchError((error) => this.handleError(error, 'recupero dei prodotti'))
    )
  }

  getProductSummaryByUserId(userId: number): Observable<ProductSummaryDTO[]> {
    const params = new HttpParams().set('userId', userId);

    return this.http.get<ProductSummaryDTO[]>(`${this.apiUrl}/summaryByUserId`, {params}).pipe(
      map((response: ProductSummaryDTO[]) => {
        return response;
      }),
      catchError((error) => this.handleError(error, 'recupero dei prodotti'))
    );
  }

  getProductDetails(productId: number): Observable<ProductDetailsDTO> {
    const params = new HttpParams().set('productId', productId);

    return this.http.get<ProductDetailsDTO>(`${this.apiUrl}/details`, {params}).pipe(
      map((response: ProductDetailsDTO) => {
        return response;
      }),
      catchError((error) => this.handleError(error, 'recupero dei prodotti'))
    );
  }

  searchTags(query: string): Observable<TagResponseDTO[]> {
    const params = new HttpParams().set('nameFilter', query);

    return this.http.get<TagResponseDTO[]>(`${this.apiUrl}/getTags`, {params}).pipe(
      map((response: TagResponseDTO[]) => {
        return response;
      }),
      catchError((error) => this.handleError(error, 'recupero dei prodotti'))
    );
  }

  createProduct(productRequestDTO: ProductRequestDTO, images: File[]): Observable<ProductDetailsDTO> {
    const formData = new FormData();

    formData.append('productRequestDTO', new Blob([JSON.stringify(productRequestDTO)], {type: 'application/json'}));

    images.forEach(image => formData.append('images', image));

    return this.http.post<ProductDetailsDTO>(`${this.apiUrl}/createProduct`, formData).pipe(
      map((response: ProductDetailsDTO) => response),
      catchError((error) => this.handleError(error, 'recupero dei prodotti'))
    );
  }

}
