import {UserResponseDTO} from '../user/UserResponseDTO';

export class ReviewResponseDTO {
  id: number;
  comment: string;
  dateCreation: Date;
  ratingQuality: number;
  ratingCommunication: number;
  ratingTimeliness: number;
  ratingCost: number;
  totalRating: number;
  user: UserResponseDTO;
  imagesPath: string[];

  constructor(
    id: number = 0,
    comment: string = '',
    dateCreation: Date = new Date(),
    ratingQuality: number = 0,
    ratingCommunication: number = 0,
    ratingTimeliness: number = 0,
    ratingCost: number = 0,
    totalRating: number = 0,
    user: UserResponseDTO = new UserResponseDTO(),
    imagesPath: string[] = []
  ) {
    this.id = id;
    this.comment = comment;
    this.dateCreation = dateCreation;
    this.ratingQuality = ratingQuality;
    this.ratingCommunication = ratingCommunication;
    this.ratingTimeliness = ratingTimeliness;
    this.ratingCost = ratingCost;
    this.totalRating = totalRating;
    this.user = user;
    this.imagesPath = imagesPath;
  }
}
