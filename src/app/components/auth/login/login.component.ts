import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {UserLoginRequestDTO} from '../../../dto/request/user/UserLoginRequestDTO';
import {ErrorUtils} from '../../../util/ErrorUtils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorUtils: ErrorUtils
  ) {
  }

  ngOnInit(): void {
    this.checkLoginForm();
  }

  checkLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorUtils.showWarning('Compila tutti i campi per effettuare il login.');
      return;
    }

    this.isLoading = true;
    const request: UserLoginRequestDTO = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: () => {
        this.router.navigate(['/home']).then();
      }
    })
  }
}
