import {UserResponseDTO} from '../user/UserResponseDTO';

export class ProductSummaryDTO {
  id: number;
  title: string;
  description: string;
  user: UserResponseDTO;
  urlProductPhoto: string[];
  startPrice: number;

  constructor(
    id: number,
    title: string,
    description: string,
    user: UserResponseDTO,
    urlProductPhoto: string[],
    startPrice: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.user = user;
    this.urlProductPhoto = urlProductPhoto;
    this.startPrice = startPrice;
  }
}
