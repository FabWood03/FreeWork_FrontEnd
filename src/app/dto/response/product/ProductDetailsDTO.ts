import {ProductPackageResponseDTO} from './ProductPackageResponseDTO';
import {UserResponseDTO} from '../user/UserResponseDTO';
import {SubCategoryResponseDTO} from '../category/SubCategoryResponseDTO';
import {TagResponseDTO} from './TagResponseDTO';
import {ProductSummaryDTO} from './ProductSummaryDTO';

export class ProductDetailsDTO extends ProductSummaryDTO {
  packages: ProductPackageResponseDTO[];
  subCategory: SubCategoryResponseDTO;
  tags: TagResponseDTO[];

  constructor(
    id: number,
    title: string,
    description: string,
    user: UserResponseDTO,
    urlProductPhoto: string[],
    packages: ProductPackageResponseDTO[],
    subCategory: SubCategoryResponseDTO,
    tags: TagResponseDTO[],
    startPrice: number = 0
  ) {
    super(id, title, description, user, urlProductPhoto, startPrice);
    this.packages = packages;
    this.subCategory = subCategory;
    this.tags = tags;
  }

  static fromProductDetailsDTO(product: ProductDetailsDTO) {
    const packages = product.packages.map((packageData: ProductPackageResponseDTO) => ProductPackageResponseDTO.fromProductPackageResponseDTO(packageData));
    const subCategory = SubCategoryResponseDTO.fromSubCategoryResponseDTO(product.subCategory);
    const tags = product.tags.map((tag: TagResponseDTO) => TagResponseDTO.fromTagResponseDTO(tag));

    return new ProductDetailsDTO(
      product.id,
      product.title,
      product.description,
      UserResponseDTO.fromUserData(product.user),
      product.urlProductPhoto,
      packages,
      subCategory,
      tags,
      product.startPrice
    );
  }
}
