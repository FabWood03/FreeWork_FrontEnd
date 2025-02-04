import {TagDTO} from './TagDTO';
import {ProductPackageRequestDTO} from './ProductPackageRequestDTO';

export class ProductRequestDTO {
  title: string;
  description: string;
  subCategoryId: number;
  packages: ProductPackageRequestDTO[];
  tags: TagDTO[];

  constructor(
    title: string = '',
    description: string = '',
    subCategoryId: number = 0,
    packages: ProductPackageRequestDTO[] = [],
    tags: TagDTO[] = []
  ) {
    this.title = title;
    this.description = description;
    this.subCategoryId = subCategoryId;
    this.packages = packages;
    this.tags = tags;
  }
}
