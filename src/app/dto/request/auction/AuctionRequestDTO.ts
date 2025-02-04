export class AuctionRequestDTO {
  id: number;
  title: string;
  descriptionProduct: string;
  macroCategoryId: number;
  subCategoryId: number;
  deliveryDate: number;
  endAuctionDate: Date;
  startAuctionDate: Date;

  constructor(
    id: number = 0,
    title: string = '',
    descriptionProduct: string = '',
    macroCategoryId: number = 0,
    subCategoryId: number = 0,
    deliveryDate: number = 0,
    endAuctionDate: Date = new Date(),
    startAuctionDate: Date = new Date()
  ) {
    this.id = id;
    this.title = title;
    this.descriptionProduct = descriptionProduct;
    this.macroCategoryId = macroCategoryId;
    this.subCategoryId = subCategoryId;
    this.deliveryDate = deliveryDate;
    this.endAuctionDate = endAuctionDate;
    this.startAuctionDate = startAuctionDate;
  }

  static fromAuctionRequestDTO(formValue: any): AuctionRequestDTO {
    const dto = new AuctionRequestDTO();
    dto.title = formValue.title;
    dto.descriptionProduct = formValue.description;
    dto.macroCategoryId = formValue.macroCategory.id;
    dto.subCategoryId = formValue.subCategory.id;
    dto.startAuctionDate = formValue.startAuctionDate;
    dto.endAuctionDate = formValue.endAuctionDate;
    dto.deliveryDate = formValue.deliveryDate || 0;
    return dto;
  }
}
