export class PurchasedProductResponseDTO {
  id: number;
  productImagePhoto: string;
  productTitle: string;
  userName: string;
  userSurname: string;
  type: string;
  price: number;

  constructor(id: number, productImagePhoto: string, productTitle: string, userName: string, userSurname: string, type: string, price: number) {
    this.id = id;
    this.productImagePhoto = productImagePhoto;
    this.productTitle = productTitle;
    this.userName = userName;
    this.userSurname = userSurname;
    this.type = type;
    this.price = price;
  }

  static fromPurchasedProductData(product: any): PurchasedProductResponseDTO {
    return new PurchasedProductResponseDTO(
      product.id,
      product.productImagePhoto,
      product.productTitle,
      product.userName,
      product.userSurname,
      product.type,
      product.price
    );
  }
}
