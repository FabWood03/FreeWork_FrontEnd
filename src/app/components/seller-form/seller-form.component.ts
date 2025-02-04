import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../services/user.service';
import {DemandSellerRequestDTO} from '../../dto/request/ticket/DemandSellerRequestDTO';
import {AuthService} from '../../services/auth.service';
import {MessageService} from 'primeng/api';
import {TicketService} from '../../services/ticket.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-seller-form',
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SellerFormComponent implements OnInit {
  sellerForm: FormGroup;
  portfolioFiles: File[] = [];
  sellerRequestData: DemandSellerRequestDTO = new DemandSellerRequestDTO();
  name: string | undefined;
  surname: string | undefined;
  username: string | undefined;
  profilePhoto: File | null = null;
  profilePhotoPreviewUrl: string | null = null;

  description: string | undefined;
  date: Date[] | undefined;
  items: any[] = [];

  fileInputId: string = `file-${new Date().getTime()}`;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private ticketService: TicketService
  ) {
    this.sellerForm = this.fb.group({
      fiscalCode: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{16}$')]],
      birthDate: [null, Validators.required],
      basedId: ['', Validators.required],
      education: ['', Validators.required],
      skills: [[], Validators.required],
      languages: [[], Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUserData();
  }

  // Recupera i dati utente dal backend
  getUserData() {
    const userEmail = this.authService.getUserLoggedEmail();
    if (!userEmail) {
      return;
    }

    this.userService.getUserDetailsByEmail(userEmail).subscribe({
      next: (response) => {
        this.name = response.name;
        this.surname = response.surname;
        this.username = response.nickname;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // Gestisce la selezione della foto del profilo
  onProfilePhotoSelected(event: any): void {
    if (event.files && event.files.length > 0 && this.profilePhoto === null) {
      this.profilePhoto = event.files[0];

      if (!this.profilePhoto) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.profilePhoto);

      this.resetFileInput();
    }
  }

  resetFileInput() {
    this.fileInputId = `file-${new Date().getTime()}`; // Crea un nuovo ID
  }

  onFilesSelected(files: File[]): void {
    this.portfolioFiles = files;
  }

  submitSellerRequest(): void {
    if (this.sellerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore',
        detail: 'Compila tutti i campi richiesti.',
      });
      return;
    }

    // Popola il DTO con i dati del form
    this.sellerRequestData.fiscalCode = this.sellerForm.value.fiscalCode;
    this.sellerRequestData.birthDate = this.sellerForm.value.birthDate;
    this.sellerRequestData.basedIn = this.sellerForm.value.basedId;
    this.sellerRequestData.education = this.sellerForm.value.education;
    this.sellerRequestData.skills = this.sellerForm.value.skills;
    this.sellerRequestData.languages = this.sellerForm.value.languages;
    this.sellerRequestData.description = this.sellerForm.value.description;
    this.sellerRequestData.title = "Richiesta venditore";

    const formData = new FormData();
    formData.append('demandSeller', new Blob([JSON.stringify(this.sellerRequestData)], { type: 'application/json' }));

    if (this.profilePhoto) {
      formData.append('userPhoto', this.profilePhoto);
    }

    this.portfolioFiles.forEach((file) => {
      formData.append('portfolio', file);
    });

    // Invio della richiesta al backend
    this.ticketService.submitSellerRequest(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successo',
          detail: 'Richiesta inviata con successo!',
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: 'Si è verificato un problema durante l\'invio della richiesta.',
        });
      },
    });
  }

  onProfilePhotoCleared(): void {
    this.profilePhoto = null;
    this.profilePhotoPreviewUrl = null;
  }
}
