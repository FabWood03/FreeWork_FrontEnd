import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
