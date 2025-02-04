import {UserResponseDTO} from '../user/UserResponseDTO';

export class OfferResponseDTO {
  id: number;
  auctionId: number;
  deliveryTimeProposed: number;
  price: number;
  seller: UserResponseDTO;

  constructor(
    id: number = 0,
    auctionId: number = 0,
    deliveryTimeProposed: number = 0,
    price: number = 0.0,
    seller: UserResponseDTO = new UserResponseDTO
  ) {
    this.id = id;
    this.auctionId = auctionId;
    this.deliveryTimeProposed = deliveryTimeProposed;
    this.price = price;
    this.seller = seller;
  }

  static fromOfferData(offer: OfferResponseDTO) {
    return new OfferResponseDTO(
      offer.id,
      offer.auctionId,
      offer.deliveryTimeProposed,
      offer.price,
      UserResponseDTO.fromUserData(offer.seller)
    );
  }
}
