import {Injectable} from '@angular/core';
import {map, Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {UserResponseDTO} from '../dto/response/user/UserResponseDTO';
import {environment} from '../../environment';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtils
  ) {
  }

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  getUserDetailsByEmail(email: string): Observable<UserResponseDTO> {
    const params = new HttpParams().set('email', email); // Passa email come parametro nella query
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/getByEmail`, {params}).pipe(
      catchError(error => this.handleError(error, 'caricamento dell\'utente'))
    );
  }

  getUserDetailsById(userId: number): Observable<UserResponseDTO> {
    const params = new HttpParams().set('id', userId);
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/getById`, {params}).pipe(
      catchError(error => this.handleError(error, 'caricamento dell\'utente'))
    );
  }

  getAvatarUrl(avatarPath: string | undefined): string {
    if (!avatarPath) {
      return this.apiBaseUrl + 'defaultProfileImage.png';
    } else {
      return this.apiBaseUrl + avatarPath;
    }
  }

  deleteUser(userId: number) {
    return this.http.delete<boolean>(`${this.apiUrl}/delete?id=${userId}`);
  }

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/getAll`).pipe(
      map(users => users.map(user => {
          return user;
        },
        catchError(error => this.handleError(error, 'caricamento degli utenti'))
      ))
    );
  }

  updateUserRole(userId: number, newRole: string): Observable<UserResponseDTO> {
    const params = new HttpParams()
      .set('id', userId)
      .set('role', newRole);

    return this.http.patch<UserResponseDTO>(`${this.apiUrl}/updateRole`, {}, {params}).pipe(
      map((response: UserResponseDTO) => {
        return response;
      }),
      catchError((error) => this.handleError(error, 'aggiornamento del ruolo'))
    );
  }

  submitSellerRequest(formData: FormData) {
    return this.http.post(`${this.apiUrl}/sellerRequest`, formData).pipe(
      catchError((error) => this.handleError(error, 'errore durante la richiesta di venditore'))
    );
  }

  updateUser(formData: FormData): Observable<UserResponseDTO> {
    return this.http.patch<UserResponseDTO>(
      `${this.apiUrl}/update`,
      formData
    ).pipe(
      catchError(error => this.handleError(error, 'aggiornamento del profilo'))
    );
  }

  disableAccount(userId: number) {
    return this.http.patch<boolean>(
      `${this.apiUrl}/disable?userId=${userId}`, // Passa userId come request param
      null // Nessun body necessario
    ).pipe(
      catchError(error => this.handleError(error, 'disabilitazione dell\'account'))
    );
  }

  enableAccount(userId: number) {
    return this.http.patch<boolean>(
      `${this.apiUrl}/enable?userId=${userId}`,
      null
    ).pipe(
      catchError(error => this.handleError(error, 'abilitazione dell\'account'))
    );
  }

  getAllUsersFiltered(stringToSearch: string) {
    return this.http.post<UserResponseDTO[]>(
      `${this.apiUrl}/getUsersFiltered`,
      null,
      {params: {search: stringToSearch}}
    ).pipe(
      map(users => users.map(user => user)),
      catchError(error => this.handleError(error, 'caricamento degli utenti'))
    );
  }
}
