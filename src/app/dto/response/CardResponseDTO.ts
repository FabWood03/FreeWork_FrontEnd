import {UserResponseDTO} from './user/UserResponseDTO';
import {ProductSummaryDTO} from './product/ProductSummaryDTO';
import {AuctionSummaryDTO} from './auction/AuctionSummary';

export class CardResponseDTO {
  id: number;
  title: string;
  description: string;
  user: UserResponseDTO;
  urlProductPhoto?: string;
  startPrice?: number;

  constructor(
    id: number,
    title: string,
    description: string,
    user: UserResponseDTO,
    pictures?: string,
    startPrice?: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.user = user;
    this.urlProductPhoto = pictures;
    this.startPrice = startPrice;
  }

  static fromProductSummary(product: ProductSummaryDTO): CardResponseDTO {
    const firstImage = product.urlProductPhoto?.[0];

    return new CardResponseDTO(
      product.id,
      product.title,
      product.description,
      product.user,
      firstImage,
      product.startPrice
    );
  }

  static fromAuction(auction: AuctionSummaryDTO): CardResponseDTO {
    return new CardResponseDTO(
      auction.id,
      auction.title,
      auction.description,
      auction.user,
      undefined
    );
  }
}
