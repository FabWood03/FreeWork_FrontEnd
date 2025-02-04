export class TagResponseDTO {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static fromTagResponseDTO(tag: TagResponseDTO) {
    return new TagResponseDTO(
      tag.name
    );
  }
}
