export class DynamicAttributeDTO {
  key: string;
  value: any;

  constructor(
    key: string = '',
    value: any = null
  ) {
    this.key = key;
    this.value = value;
  }
}
