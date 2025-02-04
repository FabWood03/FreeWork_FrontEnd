export class MacroCategoryResponseDTO {
  id: number;
  name: string;

  constructor(
    id: number = 0,
    name: string = ''
  ) {
    this.id = id;
    this.name = name;
  }

  static fromMacroCategoryResponseDTO(macroCategory: MacroCategoryResponseDTO) {
    return new MacroCategoryResponseDTO(
      macroCategory.id,
      macroCategory.name
    );
  }
}
