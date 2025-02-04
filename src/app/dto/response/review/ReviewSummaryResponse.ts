import {ReviewSummary} from './ReviewSummary';

export class ReviewSummaryResponse {
  reviewSummaries: ReviewSummary[];
  totalReviews: number;
  averageRating: number;


  constructor(
    reviewSummaries: ReviewSummary[],
    totalReviews: number,
    averageRating: number
  ) {
    this.reviewSummaries = reviewSummaries;
    this.totalReviews = totalReviews;
    this.averageRating = averageRating;
  }
}
