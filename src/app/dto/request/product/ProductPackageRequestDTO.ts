import {DynamicAttributeDTO} from './DynamicAttributeDTO';

export class ProductPackageRequestDTO {
  type: string;
  price: number;
  description: string;
  deliveryTime: number;
  revisions: number;
  emailSupport: boolean;
  chatSupport: boolean;
  attributes: DynamicAttributeDTO[]

  constructor(
    type: string = '',
    price: number = 0,
    description: string = '',
    deliveryTime: number = 1,
    revision: number = 0,
    emailSupport: boolean = false,
    chatSupport: boolean = false,
    attributes: DynamicAttributeDTO[] = []
  ) {
    this.type = type;
    this.price = price;
    this.description = description;
    this.deliveryTime = deliveryTime;
    this.revisions = revision;
    this.emailSupport = emailSupport;
    this.chatSupport = chatSupport;
    this.attributes = attributes;
  }
}
