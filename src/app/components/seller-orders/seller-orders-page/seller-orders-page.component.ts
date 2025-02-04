import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OrderService} from '../../../services/order.service';
import {catchError, tap} from 'rxjs/operators';
import {OrderResponseDTO} from '../../../dto/response/OrderResponseDTO';
import {AnimationOptions} from 'ngx-lottie';
import {of} from 'rxjs';
import {OrderFilterRequest} from '../../../dto/request/OrderFilterRequest';
import {ErrorUtils} from '../../../util/ErrorUtils';
import {FilteredOrdersResponse} from '../../../dto/response/FilteredOrdersResponse';

@Component({
  selector: 'app-seller-orders-page',
  templateUrl: './seller-orders-page.component.html',
  styleUrl: './seller-orders-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SellerOrdersPageComponent implements OnInit {
  allOrders: OrderResponseDTO[] = [];
  pendingOrders: OrderResponseDTO[] = [];
  takeOnOrders: OrderResponseDTO[] = [];
  deliveredOrders: OrderResponseDTO[] = [];
  delayedOrders: OrderResponseDTO[] = [];
  refusedOrders: OrderResponseDTO[] = [];

  lottieConfigEmptyOrders: AnimationOptions = {
    path: 'assets/lottie/emptyListPaper.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
  };

  searchText: string = '';
  selectedTimeRange: { label: string, value: string } | undefined;
  timeRanges = [
    {label: 'Oggi', value: 'TODAY'},
    {label: 'Questa settimana', value: 'THIS_WEEK'},
    {label: 'Questo mese', value: 'THIS_MONTH'}
  ];

  constructor(private orderService: OrderService, private errorUtils: ErrorUtils) {
  }

  ngOnInit(): void {
    this.loadAllOrdersData();
  }

  private loadAllOrdersData(): void {
    this.orderService.getAllOrdersBySeller().pipe(
      tap((orders: OrderResponseDTO[]) => {
        this.allOrders = orders;
      })
    ).subscribe();

    this.orderService.getPendingOrdersBySeller().pipe(
      tap((orders: OrderResponseDTO[]) => {
        this.pendingOrders = orders;
      })
    ).subscribe();

    this.orderService.getTakeOnOrdersBySeller().pipe(
      tap((orders: OrderResponseDTO[]) => {
        this.takeOnOrders = orders;
      })
    ).subscribe();

    this.orderService.getDeliveredOrdersBySeller().pipe(
      tap((orders: OrderResponseDTO[]) => {
        this.deliveredOrders = orders;
      })
    ).subscribe();

    this.orderService.getDelayedOrdersBySeller().pipe(
      tap((orders: OrderResponseDTO[]) => {
        this.delayedOrders = orders;
      })
    ).subscribe();

    this.orderService.getRefusedOrdersBySeller().pipe(
      tap((orders: OrderResponseDTO[]) => {
        this.refusedOrders = orders;
      })
    ).subscribe();
  }

  filterOrdersByDateRange(): void {
    const filterRequest: OrderFilterRequest = {
      dateRangeType: this.selectedTimeRange?.value,
      searchText: this.searchText
    }

    this.orderService.getFilteredOrdersBySeller(filterRequest).pipe(
      tap((orders: FilteredOrdersResponse) => {
        this.allOrders = orders.allOrders;
        this.pendingOrders = orders.pendingOrders;
        this.takeOnOrders = orders.takeOnOrders;
        this.deliveredOrders = orders.deliveredOrders;
        this.delayedOrders = orders.delayedOrders;
        this.refusedOrders = orders.refusedOrders;
      }),
      catchError((err) => {
        this.errorUtils.showWarning('Non ci sono ordini che corrispondono ai criteri di ricerca selezionati');
        return of([]);
      })
    ).subscribe();
  }
}
