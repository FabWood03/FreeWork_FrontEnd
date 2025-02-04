export class OrderRequestDTO {
  cartId: number;
  totalPrice: number;
  description: string | { [productId: number]: string };

  constructor(
    cartId: number = 0,
    totalPrice: number = 0,
    description: string = ''
  ) {
    this.cartId = cartId;
    this.totalPrice = totalPrice;
    this.description = description;
  }
}
