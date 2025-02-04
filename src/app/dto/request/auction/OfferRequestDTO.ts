export class OfferRequestDTO {
  auctionId: number;
  deliveryTimeProposed: number;
  price: number;

  constructor(
    auctionId: number = 0,
    deliveryTimeProposed: number = 0,
    price: number = 0.01
  ) {
    this.auctionId = auctionId;
    this.deliveryTimeProposed = deliveryTimeProposed;
    this.price = price;
  }
}
