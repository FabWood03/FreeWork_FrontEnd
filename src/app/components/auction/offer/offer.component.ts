import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {environment} from '../../../../environment';
import {AuctionStatus} from '../../../enumeration/AuctionStatus';
import {OfferResponseDTO} from '../../../dto/response/auction/OfferResponseDTO';
import {AuctionService} from '../../../services/auction.service';
import {OfferService} from '../../../services/offer.service';
import {UserService} from '../../../services/user.service';
import {ErrorUtils} from '../../../util/ErrorUtils';
import {OfferRequestDTO} from '../../../dto/request/auction/OfferRequestDTO';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class OfferComponent implements OnInit {
  @Input() auctionId!: number;
  @Input() index = 0;
  @Input() offer!: OfferResponseDTO;
  @Input() isPersonalOffer = false;
  @Input() isAuctionEnd = false;
  @Input() auctionData!: { status: AuctionStatus; [key: string]: any };

  @Output() offersUpdated = new EventEmitter<OfferResponseDTO[]>();
  @Output() personalOfferUpdated = new EventEmitter<OfferResponseDTO>();
  @Output() offerCreationSuccess = new EventEmitter<void>();
  @Output() offerDeleted = new EventEmitter<number>();

  modifyOfferVisibleFlag = false;
  price = 0;
  deliveryTime = 0;
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private offerService: OfferService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private auctionService: AuctionService,
    private errorUtils: ErrorUtils
  ) {
  }

  ngOnInit(): void {
    this.loadPersonalOffer();
    this.loadAuctionOffers();
  }

  getOfferClass(): string {
    return this.isPersonalOffer ? '' : ['first-offer', 'second-offer', 'third-offer'][this.index] || '';
  }

  showModifyDialog(): void {
    this.price = this.offer.price;
    this.deliveryTime = this.offer.deliveryTimeProposed;
    this.modifyOfferVisibleFlag = true;
  }

  deleteOffer(): void {
    this.offerDeleted.emit(this.offer.id);
  }

  modifyOffer(): void {
    const offerRequest = new OfferRequestDTO(
      this.auctionId,
      this.deliveryTime,
      this.price
    );

    console.log(offerRequest);


    this.offerService.updateOffer(offerRequest).subscribe({
      next: (updatedOffer) => this.handleModifySuccess(updatedOffer),
      error: () => this.errorUtils.showError('Errore durante la modifica dell\'offerta')
    });
  }

  confirm(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Vuoi accettare questa offerta?',
      header: 'Conferma offerta',
      acceptLabel: 'Sì',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.assignWinner()
    });
  }

  goToSellerProfile(userId: number): void {
    this.router.navigate(['/sellerProfile'], {state: {userId}});
  }

  getAvatarUrl(imageFolderUrl?: string): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  private loadPersonalOffer(): void {
    this.offerService.getPersonalOffer(this.auctionId).subscribe({
      next: (offer) => this.personalOfferUpdated.emit(offer),
      error: () => this.errorUtils.showError('Errore nel recupero delle offerte')
    });
  }

  private loadAuctionOffers(): void {
    this.offerService.getOffersByAuctionId(this.auctionId).subscribe({
      next: (offers) => this.offersUpdated.emit(offers),
      error: () => this.errorUtils.showError('Errore nel recupero delle offerte')
    });
  }

  private assignWinner(): void {
    const winnerId = this.offer.seller.id;
    this.auctionService.assignWinner(this.auctionId, winnerId).subscribe({
      next: () => this.messageService.add({
        severity: 'info',
        summary: 'Confermata',
        detail: 'Offerta accettata'
      }),
      error: () => this.errorUtils.showError('Errore durante l\'assegnazione del vincitore')
    });
  }

  private handleModifySuccess(updatedOffer: OfferResponseDTO): void {
    this.errorUtils.showSuccess('Offerta modificata con successo');
    this.personalOfferUpdated.emit(updatedOffer);
    this.modifyOfferVisibleFlag = false;
  }
}
