import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ErrorUtils} from '../../../util/ErrorUtils';
import {OrderService} from '../../../services/order.service';
import {OrderProductResponseDTO} from '../../../dto/response/OrderProductResponseDTO';
import {Router} from '@angular/router';

@Component({
  selector: 'app-seller-order-single-page',
  templateUrl: './seller-order-single-page.component.html',
  styleUrl: './seller-order-single-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SellerOrderSinglePageComponent implements OnInit {
  orderProduct: OrderProductResponseDTO = new OrderProductResponseDTO();
  sellerDeliveryResponse: string = '';

  constructor(
    private errorUtils: ErrorUtils,
    private orderService: OrderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initializeSingleProductOrderData();
  }

  private initializeSingleProductOrderData(): void {
    const navigation = history.state;

    if (navigation && navigation.productOrderId) {
      const productOrderId = navigation.productOrderId as number;

      this.loadOrderProductData(productOrderId);
    } else {
      this.errorUtils.showError('Impossibile caricare i dati dell\'ordine, nessun ID trovato nei dati di navigazione.');
    }
  }

  private loadOrderProductData(productOrderId: number) {
    this.orderService.getOrderProductById(productOrderId).subscribe({
      next: (data) => {
        this.orderProduct = data;
      }
    });
  }

  deliveryResponse() {
    if (this.orderProduct.status === 'DELIVERED' || this.orderProduct.status === 'REFUSED' || this.orderProduct.status === 'PENDING') {
      this.errorUtils.showWarning('Impossibile consegnare l\'ordine, lo stato non è valido');
      return;
    }

    console.log(this.orderProduct.id);
    console.log(this.sellerDeliveryResponse);

    this.orderService.deliveryResponse(this.orderProduct.id, this.sellerDeliveryResponse).subscribe({
      next: () => {
        this.sellerDeliveryResponse = 'Consegna effettuata';
      }
    });
  }

  goToSellerOrderPage() {
    this.router.navigate(['/sellerOrdersPage']);
  }
}
