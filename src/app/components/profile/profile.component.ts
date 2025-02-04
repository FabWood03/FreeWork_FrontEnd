import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {of, Subject} from 'rxjs';
import {catchError, takeUntil, tap} from 'rxjs/operators';

import {UserService} from '../../services/user.service';
import {ProductService} from '../../services/product.service';
import {AuctionService} from '../../services/auction.service';
import {ReviewService} from '../../services/review.service';
import {AuthService} from '../../services/auth.service';
import {ErrorUtils} from '../../util/ErrorUtils';

import {UserResponseDTO} from '../../dto/response/user/UserResponseDTO';
import {ReviewResponseDTO} from '../../dto/response/review/ReviewResponseDTO';
import {ProductSummaryDTO} from '../../dto/response/product/ProductSummaryDTO';
import {AuctionSummaryDTO} from '../../dto/response/auction/AuctionSummary';
import {CardResponseDTO} from '../../dto/response/CardResponseDTO';
import {Role} from '../../enumeration/Role';
import {environment} from '../../../environment';
import {AnimationOptions} from 'ngx-lottie';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
  profilePhoto: File | undefined = undefined;
  profilePhotoPreviewUrl: string | null = null;
  fileInputId: string = `file-${new Date().getTime()}`;

  userData: UserResponseDTO = new UserResponseDTO();
  apiBaseUrl: string = environment.apiBaseUrl;
  integerStarsValue: number = 0;
  isModifyMode: boolean = false;
  newLanguage: string = '';
  newSkill: string = '';
  errorMessage: string | null = null;
  maxDate: Date = new Date();

  openAuctionCards: CardResponseDTO[] = [];
  closedAuctionCards: CardResponseDTO[] = [];
  pendingAuctions: CardResponseDTO[] = [];
  productCards: CardResponseDTO[] = [];
  userReviews: ReviewResponseDTO[] = [];
  closedAuctions: AuctionSummaryDTO[] = [];

  selectedOption: string | undefined;
  options = [
    {label: 'Ricevute', value: 'Ricevute'},
    {label: 'Fatte', value: 'Fatte'}
  ];

  lottieConfigGhost: AnimationOptions = this.getLottieConfig('ghost.json');
  lottieConfigEmptyReview: AnimationOptions = {
    path: 'assets/lottie/emptyListPaper.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  };

  // Opzioni responsive per eventuali slider/carousel
  responsiveOptions = [
    {breakpoint: '1199px', numVisible: 1, numScroll: 1},
    {breakpoint: '991px', numVisible: 2, numScroll: 1},
    {breakpoint: '767px', numVisible: 1, numScroll: 1},
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private auctionService: AuctionService,
    private reviewService: ReviewService,
    private confirmationService: ConfirmationService,
    private errorUtils: ErrorUtils,
    private authService: AuthService
  ) {
    this.maxDate.setDate(this.maxDate.getDate() - 1);
  }

  ngOnInit(): void {
    this.getUserData();
    this.fetchClosedAuctions();
    this.fetchPendingAuctions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUserData(): void {
    const email = this.authService.getUserLoggedEmail();

    if (email) {
      this.userData.email = email;
    } else {
      this.errorUtils.showError('Errore nel recupero dell\'utente');
      return;
    }

    this.userService.getUserDetailsByEmail(this.userData.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: UserResponseDTO) => {
          this.userData = response;
          this.integerStarsValue = Math.floor(this.userData.rating);
          this.loadReceivedReviews(this.userData.id);
          this.initializeProfileData();
        },
        error: (err) => {
          console.error(err);
          this.errorUtils.showError('Errore nel caricamento dei dati utente');
        }
      });
  }

  private getLottieConfig(path: string, rendererSettings: any = {}): AnimationOptions {
    return {
      path: `assets/lottie/${path}`,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      rendererSettings,
    };
  }

  private loadCreatedReviews(userId: number): void {
    this.reviewService.getReviewsByUserId(userId)
      .pipe(
        takeUntil(this.destroy$),
        tap((data: ReviewResponseDTO[]) => {
          this.userReviews = data;
        }),
        catchError(err => {
          console.error(err);
          return of(null);
        })
      )
      .subscribe();
  }

  private loadReceivedReviews(userId: number): void {
    this.reviewService.getReviewsReceivedByUserId(userId)
      .pipe(
        takeUntil(this.destroy$),
        tap((data: ReviewResponseDTO[]) => {
          this.userReviews = data;
        }),
        catchError(err => {
          console.error(err);
          return of(null);
        })
      )
      .subscribe();
  }

  filterReviews(): void {
    if (this.selectedOption === 'Fatte') {
      this.loadCreatedReviews(this.userData.id);
    } else if (this.selectedOption === 'Ricevute') {
      this.loadReceivedReviews(this.userData.id);
    }
  }

  getPortfolioUrls(): string[] {
    return this.userData.portfolio.map(url => `${this.apiBaseUrl}${url}`);
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  confirm2(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questo account?',
      acceptLabel: 'Sì',
      header: 'Conferma Eliminazione',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.userService.deleteUser(this.userData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response) {
                this.errorUtils.showSuccess('Account eliminato');
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
              } else {
                this.errorUtils.showError('Eliminazione non riuscita');
              }
            },
            error: (err) => {
              console.error(err);
              this.errorUtils.showError('Errore durante l\'eliminazione');
            }
          });
      },
      reject: () => {
        this.errorUtils.showWarning('Eliminazione annullata');
      }
    });
  }

  userIsSeller(): boolean {
    return this.userData.role === Role.SELLER.toString();
  }

  userIsBuyer(): boolean {
    return this.userData.role === Role.BUYER.toString();
  }

  private initializeProfileData(): void {
    this.loadProductSummaries();
    this.loadOpenAuctionsSummary();
    this.loadClosedAuctionsSummary();
  }

  private loadProductSummaries(): void {
    this.productService.getProductSummaryByUserId(this.userData.id)
      .pipe(
        takeUntil(this.destroy$),
        tap((products: ProductSummaryDTO[]) => {
          this.productCards = products.map(CardResponseDTO.fromProductSummary);
        }),
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  private loadOpenAuctionsSummary(): void {
    this.auctionService.getOpenAuctionsByUser()
      .pipe(
        takeUntil(this.destroy$),
        tap((auctions: AuctionSummaryDTO[]) => {
          this.openAuctionCards = auctions.map(CardResponseDTO.fromAuction);
        }),
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  private loadClosedAuctionsSummary(): void {
    this.auctionService.getClosedAuctionsByUser()
      .pipe(
        takeUntil(this.destroy$),
        tap((auctions: AuctionSummaryDTO[]) => {
          this.closedAuctionCards = auctions.map(CardResponseDTO.fromAuction);
        }),
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  fetchClosedAuctions(): void {
    this.auctionService.getClosedAuctionsByUser()
      .pipe(
        takeUntil(this.destroy$),
        tap((data: AuctionSummaryDTO[]) => {
          this.closedAuctions = data;
        }),
        catchError(err => {
          console.error(err);
          this.errorMessage = 'Failed to load closed auctions.';
          return of([]);
        })
      )
      .subscribe();
  }

  fetchPendingAuctions(): void {
    this.auctionService.getPendingAuctionsByUser()
      .pipe(
        takeUntil(this.destroy$),
        tap((data: AuctionSummaryDTO[]) => {
          this.pendingAuctions = data;
        }),
        catchError(err => {
          console.error(err);
          this.errorMessage = 'Failed to load pending auctions.';
          return of([]);
        })
      )
      .subscribe();
  }

  goToAuction(auctionId: number): void {
    this.router.navigate(['/auction'], {state: {auctionId}});
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product'], {state: {productId}});
  }

  updateUser(): void {
    const birthDate = new Date(this.userData.birthDate);

    const userRequestDto = {
      name: this.userData.name,
      surname: this.userData.surname,
      nickname: this.userData.nickname,
      birthDate: birthDate, // Format senza timezone
      education: this.userData.education,
      languages: [...this.userData.languages],
      skills: [...this.userData.skills],
      bio: this.userData.bio,
    };

    const formData = new FormData();
    formData.append('userData', new Blob([JSON.stringify(userRequestDto)], {type: 'application/json'}));

    if (this.profilePhoto) {
      formData.append('userPhoto', this.profilePhoto);
    }

    this.userService.updateUser(formData)
      .pipe(
        takeUntil(this.destroy$),
        tap((_: UserResponseDTO) => {
          this.isModifyMode = false;
          this.errorUtils.showSuccess('Profilo aggiornato');
        }),
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Aggiunge una nuova lingua alla lista delle lingue dell'utente.
   */
  addLanguage(): void {
    const trimmedLanguage = this.newLanguage.trim();
    if (trimmedLanguage) {
      this.userData.languages.push(trimmedLanguage);
      this.newLanguage = ''; // Reset dopo l'aggiunta
    }
  }

  /**
   * Rimuove una lingua dalla lista, in base all'indice.
   */
  removeLanguage(index: number): void {
    this.userData.languages.splice(index, 1);
  }

  /**
   * Aggiunge una nuova skill alla lista delle competenze dell'utente.
   */
  addSkill(): void {
    const trimmedSkill = this.newSkill.trim();
    if (trimmedSkill) {
      this.userData.skills.push(trimmedSkill);
      this.newSkill = '';
    }
  }

  /**
   * Rimuove una skill dalla lista, in base all'indice.
   */
  removeSkill(index: number): void {
    this.userData.skills.splice(index, 1);
  }

  /**
   * Gestisce la selezione della foto del profilo.
   */
  onProfilePhotoSelected(event: any): void {
    if (event.files && event.files.length > 0) {
      this.profilePhoto = event.files[0];

      if (!this.profilePhoto) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.profilePhoto);

      // Reset dell'input per permettere nuove selezioni
      this.resetFileInput();
    }
  }

  /**
   * Cambia l'ID del file input per forzare il reset del componente.
   */
  resetFileInput(): void {
    this.fileInputId = `file-${new Date().getTime()}`;
  }

  /**
   * Gestisce la rimozione della foto del profilo selezionata.
   */
  onProfilePhotoCleared(): void {
    this.profilePhoto = undefined;
    this.profilePhotoPreviewUrl = null;
  }
}
