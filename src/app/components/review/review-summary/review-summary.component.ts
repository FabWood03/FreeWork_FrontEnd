import {Component, Input, OnInit} from '@angular/core';
import {ReviewService} from '../../../services/review.service';
import {ReviewSummaryResponse} from '../../../dto/response/review/ReviewSummaryResponse';
import {ReviewSummary} from '../../../dto/response/review/ReviewSummary';
import {MeterItem} from 'primeng/metergroup';

@Component({
  selector: 'app-review-summary',
  templateUrl: './review-summary.component.html',
  styleUrls: ['./review-summary.component.css']
})
export class ReviewSummaryComponent implements OnInit {
  @Input() productId: number = 0;
  @Input() userId: number = 0;

  reviewSummaryResponse: ReviewSummaryResponse | null = null;

  value5stars: MeterItem[] = [];
  value4stars: MeterItem[] = [];
  value3stars: MeterItem[] = [];
  value2stars: MeterItem[] = [];
  value1stars: MeterItem[] = [];
  totalReviews: number = 0;

  stars: number = 0;
  integerStarsValue: number = 0;

  constructor(private reviewService: ReviewService) {
  }

  ngOnInit(): void {
    this.getReviewSummary();
  }

  private getReviewSummary(): void {
    if (this.productId > 0) {
      this.reviewService.getReviewSummaryByProductId(this.productId).subscribe({
        next: (data: ReviewSummaryResponse) => {
          this.handleReviewSummaryResponse(data);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else if (this.userId > 0) {
      this.reviewService.getReviewSummaryByUserId(this.userId).subscribe({
        next: (data: ReviewSummaryResponse) => {
          this.handleReviewSummaryResponse(data);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.error();
    }
  }

  private handleReviewSummaryResponse(data: ReviewSummaryResponse): void {
    if (!data || !data.reviewSummaries || data.totalReviews === 0) {
      console.error(data);
      return;
    }

    this.reviewSummaryResponse = data;
    this.totalReviews = data.totalReviews;
    this.stars = data.averageRating;
    this.integerStarsValue = Math.round(this.stars);

    this.updateReviewCounts();
  }

  private updateReviewCounts(): void {
    if (this.reviewSummaryResponse) {
      const reviewSummaries = this.reviewSummaryResponse.reviewSummaries;
      reviewSummaries.forEach((summary: ReviewSummary) => {
        const percentage = this.calculatePercentage(summary.count);
        const meterItem: MeterItem = {
          label: summary.rating.toString(),
          value: percentage,
          color: this.getColorForRating(summary.rating)
        };
        this.assignRatingToValueArray(summary.rating, meterItem);
      });
    }
  }

  private calculatePercentage(count: number): number {
    return this.totalReviews > 0 ? (count / this.totalReviews) * 100 : 0;
  }

  private assignRatingToValueArray(rating: number, meterItem: MeterItem): void {
    switch (rating) {
      case 5:
        this.value5stars = [meterItem];
        break;
      case 4:
        this.value4stars = [meterItem];
        break;
      case 3:
        this.value3stars = [meterItem];
        break;
      case 2:
        this.value2stars = [meterItem];
        break;
      case 1:
        this.value1stars = [meterItem];
        break;
    }
  }

  private getColorForRating(rating: number): string {
    switch (rating) {
      case 5:
        return '#86409d';
      case 4:
        return '#86409d';
      case 3:
        return '#86409d';
      case 2:
        return '#86409d';
      case 1:
        return '#86409d';
      default:
        return '#86409d';
    }
  }
}
