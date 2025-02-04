import {MacroCategoryResponseDTO} from './MacroCategoryResponseDTO';

export class SubCategoryResponseDTO {
  id: number;
  name: string;
  macroCategory: MacroCategoryResponseDTO;

  constructor(id: number, name: string, macroCategory: MacroCategoryResponseDTO) {
    this.id = id;
    this.name = name;
    this.macroCategory = macroCategory;
  }

  static fromSubCategoryResponseDTO(subCategory: SubCategoryResponseDTO) {
    if (!subCategory || !subCategory.macroCategory) {
      console.error(subCategory);
      throw new Error('subCategory o macroCategory non definito');
    }

    return new SubCategoryResponseDTO(
      subCategory.id,
      subCategory.name,
      MacroCategoryResponseDTO.fromMacroCategoryResponseDTO(subCategory.macroCategory)
    );
  }

  static mapCategories(subcategories: SubCategoryResponseDTO[]): {
    id: number;
    label: string;
    subcategories: SubCategoryResponseDTO[];
  }[] {
    const categoriesMap: Map<string, { id: number; subcategories: SubCategoryResponseDTO[] }> = new Map();

    subcategories.forEach((subcategory) => {
      if (!subcategory.macroCategory || !subcategory.macroCategory.name) {
        console.error(subcategory);
        return;
      }

      const macroCategory = subcategory.macroCategory;
      const macroCategoryName = macroCategory.name;

      if (!categoriesMap.has(macroCategoryName)) {
        categoriesMap.set(macroCategoryName, {id: macroCategory.id, subcategories: []});
      }
      categoriesMap.get(macroCategoryName)?.subcategories.push(subcategory);
    });

    return Array.from(categoriesMap, ([label, {id, subcategories}]) => ({
      id: id,
      label: label,
      subcategories: subcategories,
    }));
  }
}
