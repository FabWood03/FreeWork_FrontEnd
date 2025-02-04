import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenDTO} from '../dto/response/TokenDTO';
import {Router} from '@angular/router';
import {UserRequestDTO} from '../dto/request/user/UserRequestDTO';
import {UserLoginRequestDTO} from '../dto/request/user/UserLoginRequestDTO';
import {ErrorUtils} from '../util/ErrorUtils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorUtils: ErrorUtils
  ) {}

  private handleError(error: any, context: string): Observable<never> {
    this.errorUtils.showHttpError(error, context);
    return throwError(() => new Error(error.message || 'Errore sconosciuto'));
  }

  registerBuyer(registerData: UserRequestDTO): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.baseUrl}/registerBuyer`, registerData).pipe(
      map((response: TokenDTO) => {
        this.saveToken(response.token);
        return response;
      }),
      catchError(error => this.handleError(error, 'registrazione'))
    )
  }

  login(request: UserLoginRequestDTO): Observable<TokenDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<TokenDTO>(`${this.baseUrl}/login`, request, { headers }).pipe(
      map((response: TokenDTO) => {
        this.saveToken(response.token);
        return response;
      }),
      catchError(error => this.handleError(error, 'accesso'))
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = this.decodeToken(token);
    if (payload && payload.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(payload.exp);
      return expirationDate > new Date();
    }
    return false;
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getUserLoggedEmail(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      return payload?.sub || null;
    }
    return null;
  }
}
