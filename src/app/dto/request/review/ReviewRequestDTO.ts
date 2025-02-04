export class ReviewRequestDTO {
  id: number;
  comment?: string;
  ratingQuality: number;
  ratingCommunication: number;
  ratingTimeliness: number;
  ratingCost: number;
  productId: number;

  constructor(
    id: number = 0,
    comment: string = '',
    ratingQuality: number = 0,
    ratingCommunication: number = 0,
    ratingTimeliness: number = 0,
    ratingCost: number = 0,
    productId: number = 0
  ) {
    this.id = id;
    this.comment = comment;
    this.ratingQuality = ratingQuality;
    this.ratingCommunication = ratingCommunication;
    this.ratingTimeliness = ratingTimeliness;
    this.ratingCost = ratingCost;
    this.productId = productId;
  }

  static mapToReviewRequestDTO(review: ReviewRequestDTO) {
    return new ReviewRequestDTO(
      review.id,
      review.comment,
      review.ratingQuality,
      review.ratingCommunication,
      review.ratingTimeliness,
      review.ratingCost,
      review.productId
    );
  }
}
