import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AuctionDetailsDTO} from '../../../dto/response/auction/AuctionDetailsDTO';
import {OfferService} from '../../../services/offer.service';
import {OfferResponseDTO} from '../../../dto/response/auction/OfferResponseDTO';
import {AuctionService} from '../../../services/auction.service';
import {environment} from '../../../../environment';
import {Router} from '@angular/router';
import {ErrorUtils} from '../../../util/ErrorUtils';
import {AuthService} from '../../../services/auth.service';
import {SubCategoryResponseDTO} from '../../../dto/response/category/SubCategoryResponseDTO';
import {ConfirmationService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuctionRequestDTO} from '../../../dto/request/auction/AuctionRequestDTO';
import {AuctionDateUtils} from '../../../util/AuctionDateUtils';
import {CategoryService} from '../../../services/category.service';

@Component({
  selector: 'app-auction-page',
  templateUrl: './auctionPage.component.html',
  styleUrls: ['./auctionPage.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class AuctionPageComponent implements OnInit {
  @Input() personalOffer!: OfferResponseDTO | null;

  auctionForm!: FormGroup;
  minStartDate: Date | undefined;
  minEndDate: Date | undefined;
  description: string | undefined;
  categories: { label: string; subcategories: SubCategoryResponseDTO[] }[] = [];
  filteredSubCategories: SubCategoryResponseDTO[] = [];
  offerList: OfferResponseDTO[] = [];
  auctionData!: AuctionDetailsDTO;
  isFutureAuction: boolean = false;
  isAuctionEnd: boolean = false;
  price: number = 0;
  isLoading: boolean = true;
  modifyOfferVisibleFlag: boolean = false;
  isWinnerAssigned: boolean = false;

  apiBaseUrl = environment.apiBaseUrl;
  isPopupVisible = true;

  constructor(
    private auctionService: AuctionService,
    private offerService: OfferService,
    private router: Router,
    private errorUtils: ErrorUtils,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.minStartDate = new Date();
    this.loadCategories();
    this.initializeAuctionData();
    this.initializeForm();
  }

  private loadCategories(): void {
    this.categoryService.getSubcategoriesWithMacroCategory().subscribe((subcategories) => {
      this.categories = SubCategoryResponseDTO.mapCategories(subcategories);
    });
  }

  private initializeAuctionData(): void {
    const navigation = history.state;

    if (navigation && navigation.auctionId) {
      const auctionId = navigation.auctionId as number;
      this.loadAuctionData(auctionId);
      this.loadOffers(auctionId);
    } else {
      this.errorUtils.showError('Asta non trovata');
      this.isLoading = false;
    }
  }

  private loadOffers(auctionId: number): void {
    this.isLoading = true;

    this.offerService.getOffersByAuctionId(auctionId).subscribe({
      next: (offers) => {
        this.onOffersUpdated(offers);
      },
      error: () => {
        this.errorUtils.showError('Errore nel caricamento delle offerte');
        this.setLoadingState();
      },
    });
  }

  private loadAuctionData(auctionId: number): void {
    this.auctionService.getAuctionDetails(auctionId).subscribe({
      next: (auctionData) => {
        auctionData.startAuctionDate = new Date(auctionData.startAuctionDate);
        auctionData.endAuctionDate = new Date(auctionData.endAuctionDate);

        this.auctionData = AuctionDetailsDTO.fromAuctionDetails(auctionData);

        const now = new Date();
        const startAuctionDate = new Date(this.auctionData.startAuctionDate);
        const endAuctionDate = new Date(this.auctionData.endAuctionDate);

        if (startAuctionDate > now) {
          this.isFutureAuction = true;
        }

        if (endAuctionDate < now) {
          this.isAuctionEnd = true;
        }

        this.auctionForm.patchValue({
          title: this.auctionData.title,
          description: this.auctionData.description,
          macroCategory: this.auctionData.macroCategory.id,
          subCategory: this.auctionData.subCategory.id,
          deliveryDate: this.auctionData.deliveryDate,
          startAuctionDate: this.auctionData.startAuctionDate,
          endAuctionDate: this.auctionData.endAuctionDate
        });

        this.setLoadingState();
      },
      error: () => {
        this.errorUtils.showError('Errore nel caricamento dei dettagli dell\'asta');
        this.setLoadingState();
      },
    });
  }

  onOffersUpdated(offers: OfferResponseDTO[]): void {
    if (Array.isArray(offers)) {
      this.offerList = offers.map((offer) => OfferResponseDTO.fromOfferData(offer));
    } else {
      console.error(offers);
    }
    this.setLoadingState();
  }

  onPersonalOfferUpdated(offer: OfferResponseDTO | null): void {
    this.personalOffer = offer;
  }

  onOfferCreationSuccess(): void {
    this.errorUtils.showSuccess('Offerta creata con successo');
  }

  private setLoadingState(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onOfferDeleteSuccess() {

  }

  subscribeUserAuction() {
    this.auctionService.subscribeUserAuction(this.auctionData.id).subscribe({
      next: () => {
        this.errorUtils.showSuccess('Iscrizione all\'asta avvenuta con successo');
        this.goToHome();
      },
      error: () => {
        this.errorUtils.showError('Errore durante l\'iscrizione all\'asta');
      },
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSellerProfile(userId: number): void {
    this.router.navigate(['/sellerProfile'], {state: {userId: userId}});
  }

  checkAuctionEndAndOwner() {
    const ownerEmail = this.authService.getUserLoggedEmail();

    return this.isAuctionEnd && ownerEmail === this.auctionData.user.email;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  assignWinner() {
    this.isWinnerAssigned = true;
  }

  checkAuctionPendingAndOwner() {
    const ownerEmail = this.authService.getUserLoggedEmail();

    return this.isFutureAuction && ownerEmail === this.auctionData.user.email;
  }

  checkAuctionPendingAndIsNotOwner() {
    const ownerEmail = this.authService.getUserLoggedEmail();

    return this.isFutureAuction && ownerEmail !== this.auctionData.user.email;
  }

  hidePopupAndShowDialog() {
    this.isPopupVisible = false;
    this.modifyOfferVisibleFlag = true;
  }

  auctionDeleteConfirm(event: Event) {
    this.isPopupVisible = false;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare quest\'asta?',
      acceptLabel: 'Sì',
      header: 'Conferma Eliminazione',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.auctionService.deleteAuction(this.auctionData.id).subscribe({
          next: (response) => {
            if (response) {
              this.errorUtils.showSuccess('Asta eliminata');
              this.router.navigate(['/profile']);
            } else {
              this.errorUtils.showError('Eliminazione non riuscita');
            }
          }
        });
      },
      reject: () => {
        this.errorUtils.showWarning('Eliminazione annullata');
        this.router.navigate(['/profile']);
      }
    });
  }

  private initializeForm(): void {
    this.auctionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      macroCategory: [null, Validators.required],
      subCategory: [null, Validators.required],
      deliveryDate: [null, [Validators.required, Validators.min(1)]],
      startAuctionDate: [null, Validators.required],
      endAuctionDate: [null, Validators.required]
    });
  }

  saveAuctionChanges() {
    if (this.auctionForm.invalid) {
      this.errorUtils.showError('Compila tutti i campi obbligatori');
      return;
    }

    const formValue = this.auctionForm.value;

    const auctionRequest: AuctionRequestDTO = {
      id: this.auctionData.id,
      title: formValue.title,
      descriptionProduct: formValue.description,
      macroCategoryId: formValue.macroCategory.id,
      subCategoryId: formValue.subCategory.id,
      deliveryDate: formValue.deliveryDate,
      startAuctionDate: formValue.startAuctionDate,
      endAuctionDate: formValue.endAuctionDate
    };

    this.auctionService.updateAuction(auctionRequest).subscribe({
      next: (updatedAuction) => {
        this.auctionData = updatedAuction;
        this.errorUtils.showSuccess('Asta modificata con successo');
      },
      error: () => {
        this.errorUtils.showError('Errore durante la modifica dell\'asta');
      },
    });
  }

  onStartDateSelect(event: any): void {
    const startDate = event.value;
    this.minEndDate = AuctionDateUtils.setMinEndDate(startDate);
  }

  onMacroCategoryChange(selectedCategory: { label: string; subcategories: SubCategoryResponseDTO[] }): void {
    this.updateSubCategories(selectedCategory);
  }

  private updateSubCategories(selectedCategory: { label: string; subcategories: SubCategoryResponseDTO[] }): void {
    this.filteredSubCategories = selectedCategory ? selectedCategory.subcategories : [];
  }

}
