import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CartResponseDTO} from '../../dto/response/cart/CartResponseDTO';
import {PurchasedProductResponseDTO} from '../../dto/response/cart/PurchasedProductResponseDTO';
import {CartService} from '../../services/cart.service';
import {AnimationOptions} from 'ngx-lottie';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {OrderRequestDTO} from '../../dto/request/OrderRequestDTO';
import {environment} from '../../../environment';
import {ErrorUtils} from '../../util/ErrorUtils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {
  descriptions: { [productId: number]: string } = {};
  cart: CartResponseDTO | undefined;
  cartItems: PurchasedProductResponseDTO[] | undefined;
  total: number = 0;
  addDescriptionFlag: boolean = false;
  apiBaseUrl = environment.apiBaseUrl;

  lottieConfig: AnimationOptions = {
    path: "assets/lottie/cartEmpty.json",
    renderer: 'svg',
    loop: true,
    autoplay: true,
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private errorUtils: ErrorUtils
  ) {
  }

  ngOnInit(): void {
    this.cartService.findByUserId().subscribe({
      next: (response: CartResponseDTO) => {
        this.cart = CartResponseDTO.fromCartResponseDTO(response);
        this.cartItems = this.cart.purchasedProducts || [];
        this.calculateTotal();
      },
      error: () => {
        this.errorUtils.showError('Errore nel caricamento del carrello');
      }
    });
  }

  removePurchasedProduct(productId: number, index: number): void {
    this.cartService.removePurchasedProduct(productId).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.cartItems?.splice(index, 1);
          this.calculateTotal();
          this.errorUtils.showSuccess('Prodotto rimosso dal carrello');
        } else {
          this.errorUtils.showError('Errore nella rimozione del prodotto');
        }
      },
      error: () => {
        this.errorUtils.showError('Errore nella rimozione del prodotto');
      }
    });
  }

  calculateTotal(): number {
    if (this.cartItems && this.cartItems.length > 0) {
      this.total = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    }
    return this.total;
  }

  createOrder(): void {
    if (!this.cart || !this.cart.id) {
      this.errorUtils.showWarning('Carrello non trovato');
      return;
    }

    const orderRequest: OrderRequestDTO = {
      cartId: this.cart.id,
      totalPrice: this.calculateTotal(),
      description: JSON.stringify(this.descriptions)
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: () => {
        this.router.navigate(['/orderHistory']);
      },
      error: () => {
        this.errorUtils.showError('Errore durante la creazione dell\'ordine');
      }
    });
  }

  showDescriptionDialog() {
    this.addDescriptionFlag = true;
  }

  checkIfCartIsNotEmpty() {
    return this.cartItems && this.cartItems.length > 0;
  }
}
