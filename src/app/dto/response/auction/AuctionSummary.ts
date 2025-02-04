import {UserResponseDTO} from '../user/UserResponseDTO';

export class AuctionSummaryDTO {
  id: number;
  title: string;
  description: string;
  state: string;
  user: UserResponseDTO;

  constructor(
    id: number,
    title: string,
    description: string,
    state: string,
    user: UserResponseDTO
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.state = state;
    this.user = user;
  }
}
