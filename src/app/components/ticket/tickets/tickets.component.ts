import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TicketService} from '../../../services/ticket.service';
import {TicketResponseDTO} from '../../../dto/response/ticket/TicketResponseDTO';
import {TicketFilterRequest} from '../../../dto/request/ticket/TicketFilterRequest';
import {AnimationOptions} from 'ngx-lottie';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TicketsComponent implements OnInit {
  tickets: TicketResponseDTO[] = [];
  pendingTickets: TicketResponseDTO[] = [];
  resolvedTickets: TicketResponseDTO[] = [];
  takeOnTickets: TicketResponseDTO[] = [];

  selectedPriority: { label: string, value: string } | undefined;
  selectedTimeRange: { label: string, value: string } | undefined;
  selectedSortCreationDate: string | undefined;
  selectedCategories: { label: string, value: string }[] = [];
  searchText: string = '';

  lottieConfigEmptyTickets: AnimationOptions = {
    path: 'assets/lottie/emptyListPaper.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
  };

  priorities = [
    {label: 'Bassa', value: 'LOW'},
    {label: 'Media', value: 'MEDIUM'},
    {label: 'Alta', value: 'HIGH'}
  ];

  timeRanges = [
    {label: 'Oggi', value: 'TODAY'},
    {label: 'Questa settimana', value: 'THIS_WEEK'},
    {label: 'Questo mese', value: 'THIS_MONTH'}
  ];

  categories = [
    {label: 'Recensioni', value: 'REPORT_REVIEWS'},
    {label: 'Prodotti', value: 'REPORT_PRODUCT'},
    {label: 'Utenti', value: 'REPORT_USER'},
    {label: 'Venditore', value: 'SELLER_REQUEST'}
  ];

  constructor(private ticketDataService: TicketService) {
  }

  ngOnInit(): void {
    this.loadAllTicketsData();
  }

  private loadAllTicketsData(): void {
    this.ticketDataService.getAllTickets()
      .pipe(
        tap((data) => this.tickets = data),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();

    this.ticketDataService.getPendingTickets()
      .pipe(
        tap((data) => this.pendingTickets = data),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();

    this.ticketDataService.getResolvedTickets()
      .pipe(
        tap((data) => this.resolvedTickets = data),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();

    this.ticketDataService.getTakeOnTickets()
      .pipe(
        tap((data) => this.takeOnTickets = data),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  applyFilters(): void {
    const ticketTypes = this.selectedCategories.map(category => category.value);

    const filterRequest: TicketFilterRequest = {
      ticketTypes: ticketTypes.length > 0 ? ticketTypes : undefined,
      priority: this.selectedPriority?.value,
      searchText: this.searchText,
      dateRangeType: this.selectedTimeRange?.value,
      sortByCreationDate: this.selectedSortCreationDate
    };

    this.ticketDataService.getFilteredTickets(filterRequest)
      .pipe(
        tap((data) => {
          this.tickets = data.allTickets;
          this.pendingTickets = data.pendingTickets;
          this.resolvedTickets = data.resolvedTickets;
          this.takeOnTickets = data.takeOnTickets;
        }),
        catchError((err) => {
          console.error(err);
          return of({allTickets: [], pendingTickets: [], resolvedTickets: [], takeOnTickets: []});
        })
      )
      .subscribe();
  }

  toggleSortOrder(): void {
    if (this.selectedSortCreationDate === 'ASC') {
      this.selectedSortCreationDate = 'DESC';
    } else {
      this.selectedSortCreationDate = 'ASC';
    }
    this.applyFilters();
  }
}
