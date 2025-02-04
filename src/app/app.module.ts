import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/auth/login/login.component';
import {RegistrationComponent} from './components/auth/registration/registration.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RouterLink} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './components/home/home.component';
import {CartComponent} from './components/cart/cart.component';
import {AuthInterceptor} from './interceptor/AuthInterceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {CardComponent} from './components/card/card.component';
import {ProductComponent} from './components/product/productPage/product.component';
import {Button} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CheckboxModule} from 'primeng/checkbox';
import {ColorPickerModule} from 'primeng/colorpicker';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {RippleModule} from 'primeng/ripple';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import {TabMenuModule} from 'primeng/tabmenu';
import {LottieComponent, provideLottieOptions} from 'ngx-lottie';
import {CarouselModule} from "primeng/carousel";
import {TagModule} from 'primeng/tag';
import {AvatarModule} from "primeng/avatar";
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from "primeng/panel";
import {PackageDetailsComponent} from './components/product/package-details/package-details.component';
import {RatingModule} from 'primeng/rating';
import {ReviewComponent} from './components/review/review.component';
import {AuctionPageComponent} from './components/auction/auctionPage/auctionPage.component';
import {DividerModule} from 'primeng/divider';
import {OfferComponent} from './components/auction/offer/offer.component';
import {GalleriaModule} from "primeng/galleria";
import {DialogModule} from 'primeng/dialog';
import {CountdownComponent} from './components/auction/countdown/countdown.component';
import {ChipsModule} from 'primeng/chips';
import {ToastModule} from "primeng/toast";
import {MessageService} from 'primeng/api';
import {OfferManagerComponent} from './components/auction/offer-manager/offer-manager.component';
import {MenubarModule} from 'primeng/menubar';
import {RulesComponent} from './components/auction/rules/rules.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {CreateProductComponent} from './components/create-product/create-product.component';
import {TicketsComponent} from './components/ticket/tickets/tickets.component';
import {TicketPageComponent} from './components/ticket/ticket-page/ticket-page.component';
import {SingleTicketComponent} from './components/ticket/single-ticket/single-ticket.component';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {StepperModule} from 'primeng/stepper';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule} from 'primeng/table';
import {SellerFormComponent} from './components/seller-form/seller-form.component';
import {SellerProfileComponent} from './components/seller-profile/seller-profile.component';
import {ChipModule} from 'primeng/chip';
import {MeterGroupModule} from 'primeng/metergroup';
import {BadgeModule} from 'primeng/badge';
import {ReviewSummaryComponent} from './components/review/review-summary/review-summary.component';
import {FilePickerComponent} from './components/file-picker/file-picker.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ImageModule} from 'primeng/image';
import {ProfileComponent} from './components/profile/profile.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {SingleOrderComponent} from './components/single-order/single-order.component';
import {StyleClassModule} from 'primeng/styleclass';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {CreateAuctionComponent} from './components/create-auction/create-auction.component';
import {UsersVisualizationComponent} from './components/users-visualization/users-visualization.component';
import {ContextMenuModule} from 'primeng/contextmenu';
import {SellerOrdersPageComponent} from './components/seller-orders/seller-orders-page/seller-orders-page.component';
import {SingleSellerOrderComponent} from './components/seller-orders/single-seller-order/single-seller-order.component';
import {
  SellerOrderSinglePageComponent
} from './components/seller-orders/seller-order-single-page/seller-order-single-page.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {ReportingComponent} from './components/reporting/reporting.component';
import {FilteredHomePageComponent} from './components/filtered-home-page/filtered-home-page.component';
import {PasswordModule} from "primeng/password";
import {ErrorInterceptor} from './interceptor/ErrorInterceptor';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SliderModule} from 'primeng/slider';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NavbarComponent,
    HomeComponent,
    CartComponent,
    SearchBarComponent,
    CardComponent,
    ProductComponent,
    PackageDetailsComponent,
    ReviewComponent,
    AuctionPageComponent,
    OfferComponent,
    CountdownComponent,
    OfferManagerComponent,
    RulesComponent,
    CreateProductComponent,
    TicketsComponent,
    TicketPageComponent,
    SingleTicketComponent,
    SellerFormComponent,
    SellerProfileComponent,
    ReviewSummaryComponent,
    FilePickerComponent,
    ProfileComponent,
    OrderHistoryComponent,
    SingleOrderComponent,
    CreateAuctionComponent,
    UsersVisualizationComponent,
    SellerOrdersPageComponent,
    SingleSellerOrderComponent,
    SellerOrderSinglePageComponent,
    ReportingComponent,
    FilteredHomePageComponent
  ],
  imports: [

    HttpClientModule, DropdownModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RouterLink,
    Button,
    FormsModule,
    CheckboxModule,
    ColorPickerModule,
    CalendarModule,
    DropdownModule,
    RippleModule,
    CardModule,
    TabViewModule,
    TabMenuModule,
    BrowserAnimationsModule,
    LottieComponent,
    CarouselModule,
    TagModule,
    AvatarModule,
    OverlayPanelModule,
    MenuModule,
    PanelModule,
    RatingModule,
    DividerModule,
    GalleriaModule,
    DialogModule,
    ChipsModule,
    ToastModule,
    MenubarModule,
    ScrollPanelModule,
    IconFieldModule,
    InputIconModule,
    InputTextareaModule,
    RadioButtonModule,
    MultiSelectModule,
    StepperModule,
    AutoCompleteModule,
    TableModule,
    ChipModule,
    MeterGroupModule,
    BadgeModule,
    FileUploadModule,
    ImageModule,
    StyleClassModule,
    TieredMenuModule,
    ContextMenuModule,
    InputNumberModule, PasswordModule, ConfirmDialogModule, SliderModule,
  ],
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,  // Gestisce gli errori HTTP
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,  // Gestisce l'autenticazione
      multi: true,
    },
    provideAnimationsAsync(),
    MessageService
  ],
  exports: [
    NavbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
