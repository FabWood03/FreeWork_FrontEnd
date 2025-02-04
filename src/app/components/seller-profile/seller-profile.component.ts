import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {CardResponseDTO} from '../../dto/response/CardResponseDTO';
import {Router} from '@angular/router';
import {ReviewResponseDTO} from '../../dto/response/review/ReviewResponseDTO';
import {UserResponseDTO} from '../../dto/response/user/UserResponseDTO';
import {UserService} from '../../services/user.service';
import {ReviewService} from '../../services/review.service';
import {environment} from '../../../environment';
import {catchError, tap} from 'rxjs/operators';
import {ProductSummaryDTO} from '../../dto/response/product/ProductSummaryDTO';
import {of} from 'rxjs';
import {ProductService} from '../../services/product.service';
import {AuctionSummaryDTO} from '../../dto/response/auction/AuctionSummary';
import {AuctionService} from '../../services/auction.service';
import {TicketService} from '../../services/ticket.service';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SellerProfileComponent implements OnInit {
  selectedUserId: number = 0;
  review!: ReviewResponseDTO;
  apiBaseUrl = environment.apiBaseUrl;
  userReviews: ReviewResponseDTO[] = [];
  @ViewChild('loadMoreTrigger') loadMoreTrigger!: ElementRef;

  auctionCards: CardResponseDTO[] = [];
  productCards: CardResponseDTO[] = [];
  visible: boolean = false;
  lottieConfigGhost: AnimationOptions = this.getLottieConfig('ghost.json');
  userData: UserResponseDTO = new UserResponseDTO();

  isLoadingReviews: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private auctionService: AuctionService,
    private reviewService: ReviewService,
    private ticketService: TicketService
  ) {
  }

  responsiveOptions = [
    {breakpoint: '1199px', numVisible: 1, numScroll: 1},
    {breakpoint: '991px', numVisible: 2, numScroll: 1},
    {breakpoint: '767px', numVisible: 1, numScroll: 1},
  ];

  lottieConfigEmptyReview: AnimationOptions = {
    path: 'assets/lottie/emptyListPaper.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  };

  integerStarsValue: number = 0;

  ngOnInit(): void {
    this.initializeProfileData();
  }

  private initializeProfileData(): void {
    const navigation = history.state;

    if (navigation && navigation.userId) {
      const userId = navigation.userId as number;

      this.getUserData(userId);
      this.loadProductSummaries(userId);
      this.loadAuctionsSummary(userId);


    } else {
      console.error();
    }
  }

  private loadReviews(userId: number): void {
    if (this.isLoadingReviews) return;
    this.isLoadingReviews = true;

    this.reviewService
      .getReviewsReceivedByUserId(userId)
      .pipe(
        tap((data) => {
          this.userReviews = data;
        }),
        catchError(() => {
          return of(null);
        }),
        tap(() => {
          this.isLoadingReviews = false;
        })
      )
      .subscribe();
  }


  private loadProductSummaries(userId: number): void {
    this.productService
      .getProductSummaryByUserId(userId)
      .pipe(
        tap((products: ProductSummaryDTO[]) => {
          this.productCards = products.map(CardResponseDTO.fromProductSummary);
        }),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      )
      .subscribe();
  }

  private getUserData(userId: number): void {
    this.userService.getUserDetailsById(userId).subscribe({
      next: (response) => {
        this.userData = UserResponseDTO.fromUserData(response);
        this.integerStarsValue = Math.round(this.userData.rating);
        if (this.userData.role === 'SELLER') {
          this.loadReviews(userId);
        }
      },
      error: (error) => {
        console.error(error);
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

  private loadAuctionsSummary(userId: number): void {
    this.auctionService
      .listActiveAndPendingAuctionsByUserId(userId)
      .pipe(
        tap((auctions: AuctionSummaryDTO[]) => {
          this.auctionCards = auctions.map(CardResponseDTO.fromAuction);
        }),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      )
      .subscribe();
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  goToAuction(auctionId: number): void {
    this.router.navigate(['/auction'], {state: {auctionId}});
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product'], {state: {productId}});
  }

  toggleDialog(userId: number): void {
    this.visible = !this.visible;
    this.selectedUserId = userId;
  }

  handleUserSubmit(data: { title: string; description: string; userId?: number }) {
    const ticketRequestDTO = {
      title: data.title,
      description: data.description,
      reportedUserId: data.userId ?? 0
    };

    this.ticketService.reportUser(ticketRequestDTO).subscribe({
      next: () => {
        this.visible = false;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  getPortfolioUrls(): string[] {
    return this.userData.portfolio.map(url => `${this.apiBaseUrl}${url}`);
  }
}
