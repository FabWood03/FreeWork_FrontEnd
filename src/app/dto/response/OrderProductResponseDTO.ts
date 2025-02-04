export class OrderProductResponseDTO {
  id: number;
  productId: number;
  productName: string;
  packageId: number;
  packageName: string;
  status: string;
  productImagePhoto: string;
  estimatedDeliveryDate: string;
  buyerId: number;
  buyerName: string;
  buyerSurname: string;
  descriptionForSeller: string;
  price: number;
  hasReview: boolean;


  constructor(
    id: number = 0,
    productId: number = 0,
    productName: string = '',
    packageId: number = 0,
    packageName: string = '',
    status: string = '',
    estimatedDeliveryDate: string = '',
    buyerId: number = 0,
    buyerName: string = '',
    buyerSurname: string = '',
    price: number = 0,
    productImagePhoto: string = '',
    descriptionForSeller: string = '',
    hasReview: boolean = false
  ) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.packageId = packageId;
    this.packageName = packageName;
    this.status = status;
    this.estimatedDeliveryDate = estimatedDeliveryDate;
    this.buyerId = buyerId;
    this.buyerName = buyerName;
    this.buyerSurname = buyerSurname;
    this.price = price;
    this.productImagePhoto = productImagePhoto;
    this.descriptionForSeller = descriptionForSeller;
    this.hasReview = hasReview;
  }
}
