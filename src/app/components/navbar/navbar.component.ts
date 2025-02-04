import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {environment} from '../../../environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  userId: number = 0;
  userName: string = '';
  userRole: string = '';
  userEmail: string | null = '';
  userImage: string | undefined = '';
  isBuyer: boolean = false;
  isModeratorOrAdmin: boolean = false;
  isBuyerOrSeller: boolean = false;
  isSeller: boolean = false;

  apiBaseUrl = environment.apiBaseUrl;

  menuItems: any[] = [];


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    if (!this.userEmail) {
      this.userEmail = this.authService.getUserLoggedEmail();
    }

    if (this.userEmail) {
      // Ottieni i dettagli utente in base all'email
      this.userService.getUserDetailsByEmail(this.userEmail).subscribe({
        next: (response) => {
          this.userId = response.id;
          this.userName = response.nickname;
          this.userRole = response.role;
          this.userImage = response.imageFolderUrl;

          this.isBuyer = this.userRole === 'BUYER';
          this.isSeller = this.userRole === 'SELLER';
          this.isModeratorOrAdmin = this.userRole === 'MODERATOR' || this.userRole === 'ADMIN';
          this.isBuyerOrSeller = this.isBuyer || this.userRole === 'SELLER';

          this.createMenuItems();
        }
      });
    } else {
      console.error();
    }
  }

  createMenuItems() {
    this.menuItems = [
      {
        label: 'Diventa un venditore',
        icon: 'fa fa-store',
        visible: this.isBuyer,
        command: () => this.goToSellerRequestPage()
      },
      {
        label: 'Ordini effettuati',
        icon: 'fa-solid fa-boxes-stacked',
        visible: this.isBuyerOrSeller,
        command: () => this.goToOrder()
      },
      {
        label: 'Ticket',
        icon: 'fa-solid fa-ticket',
        visible: this.isModeratorOrAdmin,
        command: () => this.goToTicket()
      },
      {
        label: 'Gestione utenti',
        icon: 'fa-solid fa-users',
        visible: this.isModeratorOrAdmin,
        command: () => this.goToUserVisualization()
      },
      {
        label: 'Crea asta',
        icon: 'fa-solid fa-gavel',
        visible: this.isBuyerOrSeller,
        command: () => this.goToCreateAuction()
      },
      {
        label: 'Crea prodotto',
        icon: 'fa-solid fa-box',
        visible: this.isSeller,
        command: () => this.goToCreateProduct()
      },
      {
        label: 'Ordini ricevuti',
        icon: 'fas fa-file-invoice',
        visible: this.isSeller,
        command: () => this.goToSellerOrderPage()
      },
      {
        label: 'Logout',
        icon: 'fa fa-sign-out-alt',
        visible: true,
        command: () => this.logout()
      }
    ];
  }

  goToSellerRequestPage() {
    this.router.navigate(['/sellerForm']);
  }

  logout() {
    this.authService.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  goToTicket() {
    this.router.navigate(['/tickets']);
  }

  goToOrder() {
    this.router.navigate(['/orderHistory'], {state: {userId: this.userId}});
  }

  private goToUserVisualization() {
    this.router.navigate(['/usersVisualization']);
  }

  private goToCreateAuction() {
    this.router.navigate(['/createAuction']);
  }

  private goToCreateProduct() {
    this.router.navigate(['/createProduct']);
  }

  private goToSellerOrderPage() {
    this.router.navigate(['/sellerOrdersPage']);
  }
}
