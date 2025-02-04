import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CartComponent} from './components/cart/cart.component';
import {HomeComponent} from './components/home/home.component';
import {RegistrationComponent} from './components/auth/registration/registration.component';
import {LoginComponent} from './components/auth/login/login.component';
import {ProductComponent} from './components/product/productPage/product.component';
import {AuthGuard} from './guard/auth.guard';
import {AuctionPageComponent} from './components/auction/auctionPage/auctionPage.component';
import {CreateProductComponent} from './components/create-product/create-product.component';
import {TicketsComponent} from './components/ticket/tickets/tickets.component';
import {SellerFormComponent} from './components/seller-form/seller-form.component';
import {SellerProfileComponent} from './components/seller-profile/seller-profile.component';
import {ProfileComponent} from './components/profile/profile.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {CreateAuctionComponent} from './components/create-auction/create-auction.component';
import {UsersVisualizationComponent} from './components/users-visualization/users-visualization.component';
import {SellerOrdersPageComponent} from './components/seller-orders/seller-orders-page/seller-orders-page.component';
import {FilteredHomePageComponent} from './components/filtered-home-page/filtered-home-page.component';
import {AdminOrModeratorGuardGuard} from './guard/admin-or-moderator-guard.guard';
import {SellerGuard} from './guard/seller-guard.guard';
import {BuyerGuard} from './guard/buyer-guard.guard';
import {TicketPageComponent} from './components/ticket/ticket-page/ticket-page.component';
import {BuyerOrSellerGuard} from './guard/buyer-or-seller.guard';
import {
  SellerOrderSinglePageComponent
} from './components/seller-orders/seller-order-single-page/seller-order-single-page.component';

const routes: Routes = [
  { path: 'sign-in', component: LoginComponent },
  { path: 'sign-up', component: RegistrationComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'auction', component: AuctionPageComponent, canActivate: [AuthGuard] },
  { path: 'createProduct', component: CreateProductComponent, canActivate: [AuthGuard, SellerGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard, AdminOrModeratorGuardGuard] },
  { path: 'ticketPage', component: TicketPageComponent, canActivate: [AuthGuard, AdminOrModeratorGuardGuard] },
  { path: 'sellerForm', component: SellerFormComponent, canActivate: [AuthGuard, BuyerGuard] },
  { path: 'sellerProfile', component: SellerProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'orderHistory', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'createAuction', component: CreateAuctionComponent, canActivate: [AuthGuard, BuyerOrSellerGuard] },
  { path: 'usersVisualization', component: UsersVisualizationComponent, canActivate: [AuthGuard, AdminOrModeratorGuardGuard] },
  { path: 'sellerOrdersPage', component: SellerOrdersPageComponent, canActivate: [AuthGuard, SellerGuard] },
  { path: 'sellerOrderSinglePage', component: SellerOrderSinglePageComponent, canActivate: [AuthGuard, SellerGuard] },
  { path: 'filteredHomePage', component: FilteredHomePageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
