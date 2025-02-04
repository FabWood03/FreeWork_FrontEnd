import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {Observable} from 'rxjs';
import {UserResponseDTO} from '../dto/response/user/UserResponseDTO';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const userEmail = this.authService.getUserLoggedEmail();

    if (!userEmail) {
      return new Observable((observer) => {
        observer.next(this.router.parseUrl('/sign-in'));
        observer.complete();
      });
    }

    return this.userService.getUserDetailsByEmail(userEmail).pipe(
      map((userData: UserResponseDTO) => {
        const userRole = userData.role;
        if (userRole === 'SELLER') {
          return true;
        } else {
          return this.router.parseUrl('/home');
        }
      })
    );
  }
}
