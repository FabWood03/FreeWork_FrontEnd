import {PackageAttributeResponseDTO} from './PackageAttributeResponseDTO';
import {PackageType} from '../../../enumeration/PackageType';

export class ProductPackageResponseDTO {
  id: number;
  type: PackageType;
  price: number;
  description: string;
  deliveryTime: number;
  revisions: number;
  emailSupport: boolean;
  chatSupport: boolean;
  attributes: PackageAttributeResponseDTO[];

  constructor(
    id: number,
    type: PackageType,
    price: number,
    description: string,
    deliveryTime: number,
    revisions: number,
    emailSupport: boolean,
    chatSupport: boolean,
    attributes: PackageAttributeResponseDTO[]
  ) {
    this.id = id;
    this.type = type;
    this.price = price;
    this.description = description;
    this.deliveryTime = deliveryTime;
    this.revisions = revisions;
    this.emailSupport = emailSupport;
    this.chatSupport = chatSupport;
    this.attributes = attributes;
  }

  static fromProductPackageResponseDTO(packageData: ProductPackageResponseDTO) {
    const attributes = packageData.attributes.map((attribute: PackageAttributeResponseDTO) => PackageAttributeResponseDTO.fromPackageAttributeResponseDTO(attribute));

    return new ProductPackageResponseDTO(
      packageData.id,
      packageData.type,
      packageData.price,
      packageData.description,
      packageData.deliveryTime,
      packageData.revisions,
      packageData.emailSupport,
      packageData.chatSupport,
      attributes
    );
  }
}
