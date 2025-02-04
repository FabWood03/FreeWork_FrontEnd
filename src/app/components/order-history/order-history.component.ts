import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {OrderResponseDTO} from '../../dto/response/OrderResponseDTO';
import {AnimationOptions} from 'ngx-lottie';
import {tap} from 'rxjs/operators';
import {catchError, of} from 'rxjs';
import {OrderFilterRequest} from '../../dto/request/OrderFilterRequest';
import {ReviewRequestDTO} from '../../dto/request/review/ReviewRequestDTO';
import {ReviewService} from '../../services/review.service';
import {ErrorUtils} from '../../util/ErrorUtils';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
  encapsulation: ViewEncapsulation.None
})
export class OrderHistoryComponent implements OnInit {
  reviewImages: File[] = [];
  review: ReviewRequestDTO = new ReviewRequestDTO();
  orders: OrderResponseDTO[] = [];
  selectedTimeRange: { label: string, value: string } | undefined;
  searchText: string = '';


  timeRanges = [
    {label: 'Oggi', value: 'TODAY'},
    {label: 'Questa settimana', value: 'THIS_WEEK'},
    {label: 'Questo mese', value: 'THIS_MONTH'}
  ];

  lottieConfig: AnimationOptions = {
    path: "assets/lottie/cartEmpty.json",
    renderer: 'svg',
    loop: true,
    autoplay: true,
  };
  visible: boolean = false;

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService,
    private errorUtils: ErrorUtils
  ) {
  }

  ngOnInit(): void {
    this.getOrderByUserId();
  }

  applyFilters(): void {
    const filterRequest: OrderFilterRequest = {
      searchText: this.searchText,
      dateRangeType: this.selectedTimeRange?.value,
    };

    this.orderService.getFilteredOrders(filterRequest)
      .pipe(
        tap((data: OrderResponseDTO[]) => {
          if (data && Array.isArray(data)) {
            this.orders = data.map((order: any) => ({
              ...order,
              orderProducts: order.orderProducts.map((orderProduct: any) => {
                orderProduct.status = this.translateOrderStatus(orderProduct.status);
                return orderProduct;
              })
            }));
          } else {
            this.errorUtils.showWarning('Nessun ordine trovato');
            this.orders = [];
          }
        }),
        catchError(() => {
          this.orders = [];
          return of([]);
        })
      )
      .subscribe();
  }


  getOrderByUserId(): void {
    this.orderService.getOrderByUserId().pipe(
      tap((response) => {
        if (Array.isArray(response)) {
          this.orders = response.map((order: any) => ({
            ...order,
            orderProducts: order.orderProducts.map((orderProduct: any) => {
              orderProduct.status = this.translateOrderStatus(orderProduct.status);
              return orderProduct;
            })
          }));
        } else {
          console.error(response);
          this.orders = [];
        }
      }),
      catchError((error) => {
        this.orders = [];
        return of([]);
      })
    ).subscribe();
  }

  translateOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'In attesa',
      IN_PROGRESS: 'In lavorazione',
      DELIVERED: 'Consegnato',
      REFUSED: 'Rifiutato',
      LATE_DELIVERY: 'Consegna in ritardo'
    };

    return statusMap[status] || status;
  }

  handleDialogToggle(event: { visible: boolean, productId: number }): void {
    this.visible = event.visible;
    if (event.productId) {
      this.review.productId = event.productId;
    }
  }

  handleDialogClose() {
    this.visible = false;
  }

  onFilesSelected(files: File[]): void {
    this.reviewImages = files;
  }

  submitReview(): void {
    this.review = ReviewRequestDTO.mapToReviewRequestDTO(this.review);

    this.reviewService.createReview(this.review, this.reviewImages).subscribe({
      next: () => {
        this.visible = false;
      }
    });
  }
}
