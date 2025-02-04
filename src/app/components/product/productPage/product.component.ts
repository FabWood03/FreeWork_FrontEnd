import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation,} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {ReviewService} from '../../../services/review.service';
import {ProductService} from '../../../services/product.service';
import {ProductDetailsDTO} from '../../../dto/response/product/ProductDetailsDTO';
import {ReviewPagination} from '../../../dto/response/review/ReviewPagination';
import {environment} from '../../../../environment';
import {Router} from '@angular/router';
import {TicketService} from '../../../services/ticket.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-productPage',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit, AfterViewInit {
  productData!: ProductDetailsDTO;
  reviewPagination: ReviewPagination = new ReviewPagination();
  activeIndex: number = 0;
  lottieConfigLoadingPage: AnimationOptions = this.getLottieConfig('loadingPage.json');
  lottieConfigEmptyReview: AnimationOptions = this.getLottieConfig('emptyListPaper.json');
  visible: boolean = false;
  images: { itemImageSrc: string; alt: string; title: string }[] = [];
  apiBaseUrl = environment.apiBaseUrl;
  integerStarsValue: number = 0;
  isLoading: boolean = true;
  isProductOwner: boolean = false;

  @ViewChild('loadMoreTrigger') loadMoreTrigger!: ElementRef;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private router: Router,
    private ticketService: TicketService
  ) {
  }

  ngOnInit(): void {
    this.initializeProductData();
  }

  ngAfterViewInit(): void {
    if (this.loadMoreTrigger) {
      this.setupIntersectionObserver();
    }
  }

  private initializeProductData(): void {
    const navigation = history.state;

    if (navigation && navigation.productId) {
      const productId = navigation.productId as number;
      this.loadProductData(productId);
      this.loadReviews(productId);
    } else {
      console.error();
      this.isLoading = false;
    }
  }

  private loadProductData(productId: number): void {
    this.productService.getProductDetails(productId).subscribe({
      next: (data) => {
        this.integerStarsValue = Math.round(data.user.rating);
        this.productData = ProductDetailsDTO.fromProductDetailsDTO(data);
        const loggedInUserEmail = this.authService.getUserLoggedEmail();
        this.isProductOwner = this.productData.user.email === loggedInUserEmail;
        this.initializeImages();
        this.setLoadingState();
      },
      error: (err) => {
        this.setLoadingState();
      },
    });
  }

  private loadReviews(productId: number): void {
    this.reviewService
      .getReviewsByProductId(
        productId,
        this.reviewPagination.page,
        this.reviewPagination.size
      )
      .subscribe({
        next: (data) => {
          if (data.reviews && data.reviews.length > 0) {
            data.reviews.forEach((review) => {
              review.totalRating = Math.round(review.totalRating);
            });
          }
          this.reviewPagination = ReviewPagination.fromReviewPagination(data);
          this.setLoadingState();
        },
        error: () => {
          this.setLoadingState();
        },
      });
  }

  private initializeImages(): void {
    if (this.productData && Array.isArray(this.productData.urlProductPhoto)) {
      this.images = this.productData.urlProductPhoto.map((photo, index) => ({
        itemImageSrc: this.apiBaseUrl + photo,
        alt: `Product Image ${index + 1}`,
        title: `Image ${index + 1}`
      }));
    } else {
      this.images = [
        {itemImageSrc: 'assets/placeholder.jpg', alt: 'Placeholder Image', title: 'Placeholder'}
      ];
    }
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            this.loadMoreReviews();
          }
        },
        {root: null, threshold: 0.1}
      );

      observer.observe(this.loadMoreTrigger.nativeElement);
    }
  }

  loadMoreReviews(): void {
    this.reviewPagination.incrementPage();
    this.loadReviews(this.productData.id);
  }

  private setLoadingState(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  toggleDialog() {
    this.visible = !this.visible;
  }

  goToSellerProfile(userId: number): void {
    this.router.navigate(['/sellerProfile'], {state: {userId: userId}});
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

  handleProductSubmit(data: { title: string, description: string, productId?: number }) {
    const ticketRequestDTO = {
      title: data.title,
      description: data.description,
      reportedProductId: data.productId ?? 0
    };

    this.ticketService.reportProduct(ticketRequestDTO).subscribe({
      next: () => {
        this.visible = false;
      },
      error: (error: any) => {
        this.visible = false;
        console.error(error);
      }
    });
  }
}
