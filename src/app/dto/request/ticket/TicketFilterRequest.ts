export class TicketFilterRequest {
  ticketTypes?: string[];
  priority?: string;
  searchText?: string;
  dateRangeType?: string;
  sortByCreationDate?: string;

  constructor(
    ticketTypes?: string[],
    priority?: string,
    searchText?: string,
    dateRangeType?: string,
    sortByCreationDate?: string
  ) {
    this.ticketTypes = ticketTypes;
    this.priority = priority;
    this.searchText = searchText;
    this.dateRangeType = dateRangeType;
    this.sortByCreationDate = sortByCreationDate;
  }
}
