import {Component, Input, ViewEncapsulation} from '@angular/core';
import {OrderResponseDTO} from '../../../dto/response/OrderResponseDTO';
import {UserService} from '../../../services/user.service';
import {tap} from 'rxjs/operators';
import {OrderService} from '../../../services/order.service';
import {ErrorUtils} from '../../../util/ErrorUtils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-single-seller-order',
  templateUrl: './single-seller-order.component.html',
  styleUrl: './single-seller-order.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SingleSellerOrderComponent {
  @Input() singleOrder!: OrderResponseDTO;

  constructor(private userService: UserService, private orderService: OrderService, private errorUtils: ErrorUtils, private router: Router) {}

  acceptOrder(orderProductId: number) {
    this.singleOrder.orderProducts.forEach((orderProduct) => {
      if (orderProduct.id === orderProductId) {
        if (orderProduct.status !== 'PENDING') {
          this.errorUtils.showError('Impossibile rifiutare l\'ordine, lo stato non è valido');
          return;
        }

        this.orderService.acceptOrder(orderProductId).pipe(
          tap(() => {
            orderProduct.status = 'IN_PROGRESS';
            this.errorUtils.showSuccess('Ordine accettato con successo');
          })
        ).subscribe();
      }
    });
  }

  refuseOrder(orderProductId: number) {
    this.singleOrder.orderProducts.forEach((orderProduct) => {
      if (orderProduct.id === orderProductId) {
        if (orderProduct.status !== 'PENDING') {
          this.errorUtils.showError('Impossibile rifiutare l\'ordine, lo stato non è valido');
          return;
        }

        this.orderService.refuseOrder(orderProductId).pipe(
          tap(() => {
            orderProduct.status = 'REFUSED';
            this.errorUtils.showSuccess('Ordine rifiutato con successo');
          })
        ).subscribe();
      }
    });
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  goToSingleOrderPage(productOrderId: number) {
    this.router.navigate(['/sellerOrderSinglePage'], {state: {productOrderId}});
  }
}
