import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {OfferResponseDTO} from '../../../dto/response/auction/OfferResponseDTO';
import {OfferRequestDTO} from '../../../dto/request/auction/OfferRequestDTO';
import {OfferService} from '../../../services/offer.service';
import {AuthService} from '../../../services/auth.service';
import {ErrorUtils} from '../../../util/ErrorUtils';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-offer-manager',
  templateUrl: './offer-manager.component.html',
  styleUrls: ['./offer-manager.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OfferManagerComponent implements OnInit {
  @Input() offerList: OfferResponseDTO[] = [];
  @Input() auctionId = 0;
  @Input() auctionStartDate!: Date;
  @Input() auctionEndDate!: Date;
  @Input() personalOffer!: OfferResponseDTO | null;
  @Input() auctionOwnerEmail = '';
  @Input() isAuctionEnd = false;

  @Output() offersUpdated = new EventEmitter<OfferResponseDTO[]>();
  @Output() personalOfferUpdated = new EventEmitter<OfferResponseDTO | null>();
  @Output() offerCreationSuccess = new EventEmitter<void>();
  @Output() offerDelete = new EventEmitter<OfferResponseDTO>();

  userLoggedRole = '';
  userLoggedEmail: string | null = '';
  visible = false;
  price = 0;
  deliveryTime = 0;

  constructor(
    private userService: UserService,
    private offerService: OfferService,
    private authService: AuthService,
    private errorUtils: ErrorUtils
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  handleOfferUpdated(updatedOffer: OfferResponseDTO): void {
    try {
      if (this.personalOffer?.id === updatedOffer.id) {
        this.personalOffer = { ...updatedOffer };
      }

      const index = this.offerList.findIndex(o => o.id === updatedOffer.id);
      if (index > -1) {
        this.offerList = [
          ...this.offerList.slice(0, index),
          updatedOffer,
          ...this.offerList.slice(index + 1)
        ];
      }

      this.offersUpdated.emit(this.offerList);
      this.personalOfferUpdated.emit(this.personalOffer);

    } catch (error) {
      console.error(error);
      this.errorUtils.showError('Errore durante l\'aggiornamento');
    }
  }

  showDialog(): void {
    this.visible = true;
  }

  deleteOffer(offerId: number): void {
    try {
      this.offerService.deleteOffer(this.auctionId).subscribe({
        next: () => this.handleDeleteSuccess(offerId),
        error: () => this.showDeleteError()
      });
    } catch (error) {
      this.showDeleteError();
    }
  }

  addOffer(): void {
    try {
      const offerRequest = new OfferRequestDTO(this.auctionId, this.deliveryTime, this.price);
      this.offerService.createOffer(offerRequest).subscribe({
        next: (newOffer: OfferResponseDTO) => this.handleSuccess(newOffer),
        error: () => this.visible = false,
      });
    } catch (error) {
      this.errorUtils.showError('Errore durante la creazione');
    }
  }

  checkLoggedUser(): boolean {
    const userEmail = this.authService.getUserLoggedEmail();
    if (!userEmail || this.personalOffer) return false;

    const now = new Date();
    const start = new Date(this.auctionStartDate);
    const end = new Date(this.auctionEndDate);

    return !(start > now || end < now) &&
      !['ADMIN', 'MODERATOR'].includes(this.userLoggedRole) &&
      this.auctionOwnerEmail !== userEmail;
  }

  private handleDeleteSuccess(offerId: number): void {
    const index = this.offerList.findIndex(offer => offer.id === offerId);
    if (index === -1) return;

    if (this.personalOffer?.id === offerId) {
      this.personalOfferUpdated.emit(null);
    }

    this.offerList.splice(index, 1);
    this.errorUtils.showSuccess('Offerta eliminata');
  }

  private handleSuccess(newOffer: OfferResponseDTO): void {
    this.visible = false;
    this.offerList.splice(0, 0, newOffer);
  }

  private showDeleteError(): void {
    this.errorUtils.showError('Errore durante l\'eliminazione');
  }

  private getUserData(): void {
    this.userLoggedEmail = this.authService.getUserLoggedEmail();
    if (!this.userLoggedEmail) return;

    this.userService.getUserDetailsByEmail(this.userLoggedEmail).subscribe({
      next: (response) => this.userLoggedRole = response.role
    });
  }

  onOffersUpdated(event: OfferResponseDTO[]): void {
    this.offersUpdated.emit(event);
  }

  onPersonalOfferUpdated(event: OfferResponseDTO | null): void {
    this.personalOfferUpdated.emit(event);
  }
}
