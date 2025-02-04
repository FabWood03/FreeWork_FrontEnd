import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AnimationOptions} from 'ngx-lottie';
import {CardResponseDTO} from '../../dto/response/CardResponseDTO';
import {debounceTime, tap} from 'rxjs/operators';
import {catchError, of, Subject, takeUntil} from 'rxjs';
import {FilterService} from '../../services/filter.service';
import {FilterEntitiesResponse} from '../../dto/response/FilterEntitiesResponse';
import {FilterRequest} from '../../dto/request/FilterRequest';
import {ErrorUtils} from '../../util/ErrorUtils';
import {SubCategoryResponseDTO} from '../../dto/response/category/SubCategoryResponseDTO';
import {CategoryService} from '../../services/category.service';
import {FilterStateService} from '../../services/filter-state.service';

@Component({
  selector: 'app-filtered-home-page',
  templateUrl: './filtered-home-page.component.html',
  styleUrls: ['./filtered-home-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FilteredHomePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Filter state
  selectedSubCategoryId!: number;
  maxBudget: number = 3000;
  minBudget: number = 0;
  deliveryTime: number | null = null;
  searchText: string = '';
  rangeValues: number[] = [0, 3000];

  // Data
  auctionCards: CardResponseDTO[] = [];
  pendingAuctionCards: CardResponseDTO[] = [];
  serviceCards: CardResponseDTO[] = [];
  subcategories: SubCategoryResponseDTO[] = [];

  // Observables for debounced filter updates
  private budgetSubject = new Subject<number[]>();
  private filterSubject = new Subject<{ event: any; type: string }>();

  // Lottie animations
  lottieConfigHourglass: AnimationOptions = this.getLottieConfig('hourglass.json', {
    viewBoxOnly: true,
    preserveAspectRatio: 'xMidYMid meet',
  });
  lottieConfigComingSoon: AnimationOptions = this.getLottieConfig('comingSoon.json');
  lottieConfigEmptyListLens: AnimationOptions = this.getLottieConfig('emptyListLens.json');

  // Carousel responsive options
  responsiveOptions = [
    {breakpoint: '1199px', numVisible: 1, numScroll: 1},
    {breakpoint: '991px', numVisible: 2, numScroll: 1},
    {breakpoint: '767px', numVisible: 1, numScroll: 1},
  ];

  constructor(
    private router: Router,
    private filterService: FilterService,
    private errorUtils: ErrorUtils,
    private categoryService: CategoryService,
    private filterStateService: FilterStateService
  ) {
  }

  ngOnInit(): void {
    this.getSubcategories();

    const state = history.state;

    console.log(state);
    console.log(state?.filterType);

    if (state?.filterType) {
      switch (state.filterType) {
        case 'search':
          this.searchText = state.filterValue;
          this.filterStateService.setSearchText(state.filterValue);
          this.processFilters({value: state.filterValue}, 'search');
          break;
        case 'subcategory':
          this.selectedSubCategoryId = +state.filterValue;
          this.filterStateService.setSubcategory(+state.filterValue);
          this.processFilters({value: state.filterValue}, 'subcategory');
          break;
        default:
          console.error('Invalid filter type:', state.filterType);
      }
    }

    this.filterStateService.currentSearchText.subscribe((text) => {
      if (text) this.searchText = text;
    });

    this.filterStateService.currentSubcategory.subscribe((id) => {
      if (id) this.selectedSubCategoryId = id;
    });

    this.budgetSubject.pipe(debounceTime(500)).subscribe((rangeValues) => {
      this.applyFilters({value: rangeValues}, 'range');
    });

    this.filterSubject.pipe(debounceTime(400)).subscribe(({event, type}) => {
      this.processFilters(event, type);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  updateBudget(event: any): void {
    if (event?.values && event.values.length === 2) {
      this.minBudget = event.values[0];
      this.maxBudget = event.values[1];
      this.budgetSubject.next([this.minBudget, this.maxBudget]);
    } else {
      this.errorUtils.showError('Errore nel filtraggio');
    }
  }

  applyFilters(event: any, type: string): void {
    const value = event?.value ?? event?.target?.value;

    if (value === undefined && type !== 'subcategory') {
      this.errorUtils.showError('Errore nel filtraggio');
      return;
    }

    this.filterSubject.next({event, type});
  }

  // Processa i filtri e chiama il servizio
  private processFilters(event: any, type: string): void {
    const value = event?.value ?? event?.target?.value;

    if ((value === undefined || value === null) && type !== 'subcategory') {
      this.errorUtils.showError('Errore nel filtraggio');
      return;
    }

    if (type === 'subcategory') {
      this.selectedSubCategoryId = value || null;
      this.filterStateService.setSubcategory(value || null);
    }

    const filterRequest: FilterRequest = {
      subCategory: this.selectedSubCategoryId,
      maxBudget: type === 'range' ? value[1] : this.maxBudget,
      minBudget: type === 'range' ? value[0] : this.minBudget,
      deliveryTime: type === 'deliveryTime' ? value : this.deliveryTime,
      searchText: type === 'search' ? value : this.searchText,
    };

    this.filterService.filterHome(filterRequest).pipe(
      takeUntil(this.destroy$),
      tap((response: FilterEntitiesResponse) => {
        this.auctionCards = response.filteredAuctions
          .filter((auction) => auction.state === 'OPEN')
          .map(CardResponseDTO.fromAuction);
        this.serviceCards = [...response.filteredProducts.map(CardResponseDTO.fromProductSummary)];
        this.pendingAuctionCards = response.filteredAuctions
          .filter((auction) => auction.state === 'PENDING')
          .map(CardResponseDTO.fromAuction);
      }),
      catchError(() => {
        this.errorUtils.showError('Errore nel filtraggio');
        return of([]);
      })
    ).subscribe();
  }

  getSubcategories(): void {
    this.categoryService.getSubcategories().pipe(
      takeUntil(this.destroy$),
      tap((subcategories: SubCategoryResponseDTO[]) => {
        this.subcategories = subcategories.map((subcategory) => ({
          ...subcategory,
          id: subcategory.id,
          label: subcategory.name,
        }));
      }),
      catchError(() => {
        this.errorUtils.showError('Errore nel recupero delle sottocategorie');
        return of([]);
      })
    ).subscribe();
  }

  goToAuction(auctionId: number): void {
    this.router.navigate(['/auction'], {state: {auctionId}});
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product'], {state: {productId}});
  }

  validateRange(): void {
    if (this.rangeValues[0] > this.rangeValues[1]) {
      [this.rangeValues[0], this.rangeValues[1]] = [this.rangeValues[1], this.rangeValues[0]];
    }

    this.rangeValues = [
      Math.max(0, Math.min(this.rangeValues[0], 3000)),
      Math.max(0, Math.min(this.rangeValues[1], 3000)),
    ];

    this.updateBudget({values: this.rangeValues});
  }
}
