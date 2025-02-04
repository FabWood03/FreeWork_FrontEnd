export class FilterRequest {
  subCategory: number;
  maxBudget: number;
  minBudget: number;
  deliveryTime: number;
  searchText: string;

  constructor(
    subCategory: number = 0,
    maxBudget: number = 0,
    minBudget: number = 0,
    deliveryTime: number = 0,
    searchText: string = ''
  ) {
    this.subCategory = subCategory;
    this.maxBudget = maxBudget;
    this.minBudget = minBudget;
    this.deliveryTime = deliveryTime;
    this.searchText = searchText
  }
}
