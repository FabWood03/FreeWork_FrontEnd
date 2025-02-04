import {PurchasedProductResponseDTO} from './PurchasedProductResponseDTO';

export class CartResponseDTO {
  id: number;
  purchasedProducts: PurchasedProductResponseDTO[];

  constructor(id: number, purchasedProducts: PurchasedProductResponseDTO[]) {
    this.id = id;
    this.purchasedProducts = purchasedProducts;
  }

  static fromCartResponseDTO(response: CartResponseDTO) {
    const purchasedProducts = response.purchasedProducts.map((product: PurchasedProductResponseDTO) => PurchasedProductResponseDTO.fromPurchasedProductData(product));

    return new CartResponseDTO(
      response.id,
      purchasedProducts
    );
  }
}
