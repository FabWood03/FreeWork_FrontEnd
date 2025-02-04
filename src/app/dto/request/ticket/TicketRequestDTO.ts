export class TicketRequestDTO {
  title: string;
  description: string;
  reportedReviewId?: number;
  reportedProductId?: number;
  reportedUserId?: number;

  constructor(
    title: string,
    description: string,
    reportedReviewId?: number,
    reportedProductId?: number,
    reportedUserId?: number
  ) {
    this.title = title;
    this.description = description;
    this.reportedReviewId = reportedReviewId;
    this.reportedProductId = reportedProductId;
    this.reportedUserId = reportedUserId;
  }
}
