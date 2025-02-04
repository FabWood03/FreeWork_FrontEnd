import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserRequestDTO} from '../../../dto/request/user/UserRequestDTO';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent {
  showAlert: boolean = false;
  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      nickname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

  onSubmit() {
    const registerData: UserRequestDTO = this.registrationForm.value;
    this.authService.registerBuyer(registerData).subscribe({
      next: (response) => {
        if (response) {
          this.router.navigate(['/home']).then();
        }
      }
    })
  }
}
