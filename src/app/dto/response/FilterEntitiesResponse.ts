import {AuctionSummaryDTO} from './auction/AuctionSummary';
import {ProductSummaryDTO} from './product/ProductSummaryDTO';

export class FilterEntitiesResponse {
  filteredAuctions: AuctionSummaryDTO[] = [];
  filteredProducts: ProductSummaryDTO[] = [];

  constructor(
    filteredAuctions: AuctionSummaryDTO[] = [],
    filteredProducts: ProductSummaryDTO[] = []
  ) {
    this.filteredAuctions = filteredAuctions;
    this.filteredProducts = filteredProducts;
  }
}
