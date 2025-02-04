import {UserResponseDTO} from '../user/UserResponseDTO';
import {MacroCategoryResponseDTO} from '../category/MacroCategoryResponseDTO';
import {SubCategoryResponseDTO} from '../category/SubCategoryResponseDTO';
import {AuctionSummaryDTO} from './AuctionSummary';

export class AuctionDetailsDTO extends AuctionSummaryDTO {
  macroCategory: MacroCategoryResponseDTO;
  subCategory: SubCategoryResponseDTO;
  deliveryDate: number;
  startAuctionDate: Date;
  endAuctionDate: Date;
  winnerId: number;

  constructor(
    id: number,
    title: string,
    description: string,
    state: string,
    user: UserResponseDTO,
    macroCategory: MacroCategoryResponseDTO,
    subCategory: SubCategoryResponseDTO,
    deliveryDate: number,
    startAuctionDate: Date,
    endAuctionDate: Date,
    winnerId: number
  ) {
    super(id, title, state, description, user);
    this.macroCategory = macroCategory;
    this.subCategory = subCategory;
    this.deliveryDate = deliveryDate;
    this.startAuctionDate = startAuctionDate;
    this.endAuctionDate = endAuctionDate;
    this.winnerId = winnerId;
  }

  static fromAuctionDetails(auctionData: AuctionDetailsDTO): AuctionDetailsDTO {
    return new AuctionDetailsDTO(
      auctionData.id,
      auctionData.title,
      auctionData.description,
      auctionData.state,
      auctionData.user,
      auctionData.macroCategory,
      auctionData.subCategory,
      auctionData.deliveryDate,
      auctionData.startAuctionDate,
      auctionData.endAuctionDate,
      auctionData.winnerId
    );
  }
}
