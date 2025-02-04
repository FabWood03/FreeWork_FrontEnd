import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductPackageResponseDTO} from '../../../dto/response/product/ProductPackageResponseDTO';
import {CartService} from '../../../services/cart.service';
import {PurchasedProductRequestDTO} from '../../../dto/request/product/PurchasedProductRequestDTO';
import {AnimationOptions} from 'ngx-lottie';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PackageDetailsComponent implements OnInit{
  @Input() productPackage!: ProductPackageResponseDTO;
  @Input() productId!: number;
  @Input() productOwnerEmail!: string;

  isModalVisible: boolean = false;
  userLoggedEmail: string | null = '';
  userLoggedRole: string = '';

  lottieConfigCartCheckout: AnimationOptions = {
    path: 'assets/lottie/cartCheckout.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
  };

  constructor(
    private cartService: CartService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  addToCart() {
    const purchasedProduct: PurchasedProductRequestDTO = {
      productId: this.productId,
      packageId: this.productPackage.id,
    };

    this.cartService.addToCart(purchasedProduct).subscribe({
      next: () => {
        this.isModalVisible = true;
      },
      error: () => {
        this.showMessage('error', 'Errore', 'Si è verificato un errore durante l\'aggiunta al carrello.');
      },
    });
  }

  continueShopping() {
    this.isModalVisible = false; // Chiudi il dialog
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({severity, summary, detail});
  }

  checkLoggedUser(): boolean {
    if (this.userLoggedRole === 'ADMIN' || this.userLoggedRole === 'MODERATOR') {
      return false;
    }

    const userLoggedEmail = this.authService.getUserLoggedEmail();
    return this.productOwnerEmail === userLoggedEmail;
  }

  getUserData() {
    if (!this.userLoggedEmail) {
      this.userLoggedEmail = this.authService.getUserLoggedEmail();
    }

    if (this.userLoggedEmail) {
      this.userService.getUserDetailsByEmail(this.userLoggedEmail).subscribe({
        next: (response) => {
          this.userLoggedRole = response.role;
        }
      });
    } else {
      console.error();
    }

  }

  ngOnInit(): void {
    this.getUserData();
  }
}
