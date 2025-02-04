export class PackageAttributeResponseDTO {
  key: string;
  value: any;

  constructor(
    key: string,
    value: any
  ) {
    this.key = key;
    this.value = value;
  }

  static fromPackageAttributeResponseDTO(attribute: PackageAttributeResponseDTO) {
    return new PackageAttributeResponseDTO(
      attribute.key,
      attribute.value
    );
  }
}
