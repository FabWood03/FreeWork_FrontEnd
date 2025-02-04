export class AuctionDateUtils {
  static setMinEndDate(startDate: Date | null = null): Date {
    const minEndDate = startDate ? new Date(startDate) : new Date();
    minEndDate.setHours(minEndDate.getHours() + 24);
    return minEndDate;
  }
}
