import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FilterEntitiesResponse} from '../dto/response/FilterEntitiesResponse';
import {FilterRequest} from '../dto/request/FilterRequest';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private baseUrl = 'http://localhost:8080/api/filter';

  constructor(private http: HttpClient) {}

  filterHome(filterRequest: FilterRequest): Observable<FilterEntitiesResponse> {
    return this.http.post<FilterEntitiesResponse>(`${this.baseUrl}/filterHome`, filterRequest);
  }
}
