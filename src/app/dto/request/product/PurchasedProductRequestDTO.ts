export class PurchasedProductRequestDTO{
  productId: number;
  packageId: number;

  constructor(
    productId: number = 0,
    packageId: number = 0
  ){
    this.productId = productId;
    this.packageId = packageId;
  }
}
