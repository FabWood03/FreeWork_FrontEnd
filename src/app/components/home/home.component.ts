import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {forkJoin, of, Subject, takeUntil} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {AnimationOptions} from 'ngx-lottie';
import Typewriter from 'typewriter-effect/dist/core';

// Services
import {CategoryService} from '../../services/category.service';
import {ProductService} from '../../services/product.service';
import {AuctionService} from '../../services/auction.service';

// DTOs
import {SubCategoryResponseDTO} from '../../dto/response/category/SubCategoryResponseDTO';
import {CardResponseDTO} from '../../dto/response/CardResponseDTO';

// Constants
const CAROUSEL_RESPONSIVE_OPTIONS = [
  {breakpoint: '1199px', numVisible: 1, numScroll: 1},
  {breakpoint: '991px', numVisible: 2, numScroll: 1},
  {breakpoint: '767px', numVisible: 1, numScroll: 1},
];

const TYPEWRITER_TEXTS = [
  'Cerca il servizio perfetto per te!',
  'Scopri le migliori opzioni!',
  'Trova ciò di cui hai bisogno!',
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // Component State
  isLoading = true;
  activeSubcategories: SubCategoryResponseDTO[] | null = null;
  subcategoryPosition = {top: '0px', left: '0px'};
  mouseOverCategory = false;
  mouseOverPopup = false;

  // Data
  auctionCards: CardResponseDTO[] = [];
  pendingAuctionCards: CardResponseDTO[] = [];
  serviceCards: CardResponseDTO[] = [];
  categories: { label: string; subcategories: SubCategoryResponseDTO[] }[] = [];

  private typewriterElement!: ElementRef;
  private typewriterInitialized = false;

  @ViewChild('typewriterElement') set _typewriterElement(el: ElementRef) {
    if (el && !this.typewriterInitialized) {
      this.typewriterElement = el;
      this.initializeTypewriter();
      this.typewriterInitialized = true;
    }
  }

  private initializeTypewriter(): void {
    new Typewriter(this.typewriterElement.nativeElement, {
      strings: TYPEWRITER_TEXTS,
      autoStart: true,
      loop: true,
      delay: 75,
    });
  }

  // Lottie Animations
  readonly lottieConfigs = {
    loadingPage: this.getLottieConfig('loadingPage.json'),
    hourglass: this.getLottieConfig('hourglass.json', {
      viewBoxOnly: true,
      preserveAspectRatio: 'xMidYMid meet',
    }),
    comingSoon: this.getLottieConfig('comingSoon.json'),
    emptyList: this.getLottieConfig('emptyListLens.json'),
  };

  // Carousel Configuration
  readonly responsiveOptions = CAROUSEL_RESPONSIVE_OPTIONS;

  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private auctionService: AuctionService,
    private productService: ProductService,
    private router: Router,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.initializeTypewriterAfterLoad();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.isLoading = true;

    forkJoin({
      categories: this.categoryService.getSubcategoriesWithMacroCategory(),
      auctions: this.auctionService.listActiveAuctions(),
      pendingAuctions: this.auctionService.listPendingAuctions(),
      products: this.productService.getAllProductSummary()
    }).pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error(error);
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        if (!results) return;

        this.categories = SubCategoryResponseDTO.mapCategories(results.categories);
        this.auctionCards = results.auctions.map(CardResponseDTO.fromAuction);
        this.pendingAuctionCards = results.pendingAuctions.map(CardResponseDTO.fromAuction);
        this.serviceCards = results.products.map(CardResponseDTO.fromProductSummary);
      }
    });
  }

  private initializeTypewriterAfterLoad(): void {
    const checkInterval = setInterval(() => {
      if (!this.isLoading) {
        this.initializeTypewriter();
        clearInterval(checkInterval);
      }
    }, 500);
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

  handleCategoryHover(category: { label: string; subcategories: SubCategoryResponseDTO[] }, index: number): void {
    this.activeSubcategories = category.subcategories;
    const categoryElements = this.elementRef.nativeElement.querySelectorAll('.category-item');

    if (!categoryElements[index]) return;

    const rect = categoryElements[index].getBoundingClientRect();
    this.subcategoryPosition = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + rect.width / 2}px`
    };
    this.mouseOverCategory = true;
  }

  getChunkedSubcategories(subcategories: SubCategoryResponseDTO[]): SubCategoryResponseDTO[][] {
    const chunkSize = 6;
    return Array.from(
      {length: Math.ceil(subcategories.length / chunkSize)},
      (_, i) => subcategories.slice(i * chunkSize, i * chunkSize + chunkSize)
    );
  }

  onSearch(searchText: string): void {
    this.navigateToFilteredPage('search', searchText);
  }

  onCategoryMouseEnter(category: any, index: number): void {
    this.handleCategoryHover(category, index);
  }

  onMouseLeave(element: 'category' | 'popup'): void {
    if (element === 'category') {
      this.mouseOverCategory = false;
    } else if (element === 'popup') {
      this.mouseOverPopup = false;
    }

    setTimeout(() => {
      if (!this.mouseOverCategory && !this.mouseOverPopup) {
        this.activeSubcategories = null;
      }
    }, 100);
  }

  onSubcategoryClick(subcategoryId: number): void {
    this.navigateToFilteredPage('subcategory', subcategoryId.toString());
  }

  goToAuction(auctionId: number): void {
    this.router.navigate(['/auction'], {state: {auctionId: auctionId}});
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product'], {state: {productId: productId}});
  }

  private navigateToFilteredPage(filterType: 'search' | 'subcategory', filterValue: string): void {
    this.router.navigate(['/filteredHomePage'], {
      state: {filterType, filterValue}
    });
  }

  onMouseEnter(element: 'category' | 'popup'): void {
    if (element === 'category') {
      this.mouseOverCategory = true;
    } else if (element === 'popup') {
      this.mouseOverPopup = true;
    }
  }
}
