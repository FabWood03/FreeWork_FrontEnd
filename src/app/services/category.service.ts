import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {SubCategoryResponseDTO} from '../dto/response/category/SubCategoryResponseDTO';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/subCategory';

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) { }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  getSubcategoriesWithMacroCategory(): Observable<SubCategoryResponseDTO[]> {
    return this.http.get<SubCategoryResponseDTO[]>(`${this.baseUrl}/getAll`).pipe(
      map((response: SubCategoryResponseDTO[]) => {
        return response;
      }),
      catchError(error => this.handleError(error, 'recupero sottocategorie'))
    );
  }

  getSubcategories(): Observable<SubCategoryResponseDTO[]> {
    return this.http.get<SubCategoryResponseDTO[]>(`${this.baseUrl}/getAll`).pipe(
      map((response: SubCategoryResponseDTO[]) => {
        return response;
      }),
      catchError(error => this.handleError(error, 'recupero sottocategorie'))
    );
  }
}
