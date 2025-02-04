import {OrderProductResponseDTO} from './OrderProductResponseDTO';

export class OrderResponseDTO {
  id: number;
  purchaseDate: string;
  orderProducts: OrderProductResponseDTO[];
  totalPrice: number;
  buyerName: string;
  buyerSurname: string;
  buyerPhoto: string;

  constructor(
    id: number = 0,
    purchaseDate: string = '',
    orderProducts: OrderProductResponseDTO[] = [],
    totalPrice: number = 0,
    buyerName: string = '',
    buyerSurname: string = '',
    buyerPhoto: string = ''
  ) {
    this.id = id;
    this.purchaseDate = purchaseDate;
    this.orderProducts = orderProducts;
    this.totalPrice = totalPrice;
    this.buyerName = buyerName;
    this.buyerSurname = buyerSurname;
    this.buyerPhoto = buyerPhoto;
  }
}
