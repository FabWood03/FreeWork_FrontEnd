import {ReviewResponseDTO} from './ReviewResponseDTO';

export class ReviewPagination {
  page: number = 0;
  size: number = 5;
  totalReviews: number = 0;
  totalPages: number = 0;
  reviews: ReviewResponseDTO[] = [];
  hasMoreReviews: boolean = true;

  constructor(size: number = 5) {
    this.size = size;
  }

  incrementPage() {
    this.page++;
  }

  updateHasMoreReviews() {
    this.hasMoreReviews = this.reviews.length < this.totalReviews;
  }

  static fromReviewPagination(data: any): ReviewPagination {
    const reviewPagination = new ReviewPagination();
    reviewPagination.reviews = data.content || [];
    reviewPagination.totalReviews = data.page?.totalElements || 0;
    reviewPagination.totalPages = data.page?.totalPages || 0;
    reviewPagination.page = data.page?.number || 0;
    reviewPagination.size = data.page?.size || 5;

    reviewPagination.updateHasMoreReviews();

    return reviewPagination;
  }
}
