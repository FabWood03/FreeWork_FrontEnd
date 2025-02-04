import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DropdownChangeEvent} from 'primeng/dropdown';
import {CategoryService} from '../../services/category.service';
import {SubCategoryResponseDTO} from '../../dto/response/category/SubCategoryResponseDTO';
import {ProductRequestDTO} from '../../dto/request/product/ProductRequestDTO';
import {TableRow} from '../../dto/request/product/TableRow';
import {TagDTO} from '../../dto/request/product/TagDTO';
import {ProductService} from '../../services/product.service';
import {TagResponseDTO} from '../../dto/response/product/TagResponseDTO';
import {FilePickerComponent} from '../file-picker/file-picker.component';
import {ProductPackageRequestDTO} from '../../dto/request/product/ProductPackageRequestDTO';
import {Router} from '@angular/router';
import {DynamicAttributeDTO} from '../../dto/request/product/DynamicAttributeDTO';
import {Message, MessageService} from 'primeng/api';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProductComponent implements OnInit {
  messages: Message[] = [];
  product: ProductRequestDTO = new ProductRequestDTO();
  categories: { label: string; subcategories: SubCategoryResponseDTO[] }[] = [];
  filteredSubCategories: SubCategoryResponseDTO[] = [];
  selectedMacroCategory: { label: string; subcategories: SubCategoryResponseDTO[] } | null = null;
  selectedSubCategory: SubCategoryResponseDTO | null = null;

  @ViewChild(FilePickerComponent) filePicker!: FilePickerComponent;

  title: string | undefined;
  selectedItems: any[] = [];
  tags: TagDTO[] = [];
  images: File[] = [];

  inputTypes = [
    {label: 'Testo', value: 'text'},
    {label: 'Checkbox', value: 'checkbox'},
    {label: 'Numero', value: 'integer'}
  ];
  selectedInputType: { label: string; value: 'text' | 'checkbox' } | undefined;

  rows: TableRow[] = [
    new TableRow('DESCRIZIONE', '', '', '', false, 'text'),
    new TableRow('PREZZO', '', '', '', false, 'decimal'),
    new TableRow('TEMPO DI CONSEGNA', '', '', '', false, 'integer'),
    new TableRow('REVISIONI', false, false, false, false, 'integer'),
    new TableRow('SUPPORTO VIA EMAIL', false, false, false, false, 'checkbox'),
  ];

  constructor(private categoryService: CategoryService, private productService: ProductService, private router: Router, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getSubcategoriesWithMacroCategory().subscribe((subcategories) => {
      this.categories = this.mapCategories(subcategories);
    });
  }

  private mapCategories(subcategories: SubCategoryResponseDTO[]): {
    label: string;
    subcategories: SubCategoryResponseDTO[]
  }[] {
    const categoriesMap: Map<string, SubCategoryResponseDTO[]> = new Map();

    subcategories.forEach((subcategory) => {
      const macroCategoryName = subcategory.macroCategory.name;
      if (!categoriesMap.has(macroCategoryName)) {
        categoriesMap.set(macroCategoryName, []);
      }
      categoriesMap.get(macroCategoryName)?.push(subcategory);
    });

    return Array.from(categoriesMap, ([label, subcategories]) => ({
      label: label,
      subcategories: subcategories
    }));
  }

  searchTags(event: { query: string }) {
    const query = event.query;
    if (query.length > 1) {
      this.fetchTags(query);
    }
  }

  private fetchTags(query: string): void {
    this.productService.searchTags(query).subscribe((tags: TagResponseDTO[]) => {
      this.tags = tags;
    });
  }

  onMacroCategoryChange(selectedCategory: { label: string; subcategories: SubCategoryResponseDTO[] }): void {
    this.updateSubCategories(selectedCategory);
  }

  private updateSubCategories(selectedCategory: { label: string; subcategories: SubCategoryResponseDTO[] }): void {
    this.filteredSubCategories = selectedCategory ? selectedCategory.subcategories : [];
    this.selectedSubCategory = null;
  }

  addRow(event: DropdownChangeEvent): void {
    const type = event.value.value;

    if (type) {
      const newRow = this.createRow(type);
      this.rows.push(newRow);
    } else {
      console.error(type);
    }
  }

  private createRow(type: 'text' | 'checkbox' | 'integer'): TableRow {
    return TableRow.createDefault(type);
  }

  deleteRow(rowIndex: number): void {
    this.rows.splice(rowIndex, 1);
  }

  createProduct(): void {
    this.prepareProductData();

    // Validazione dei campi
    if (this.validateFields()) {
      // Verifica delle immagini
      if (this.isImagesValid()) {
        this.submitProductData();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: 'Le immagini sono obbligatorie.'
        });
      }
    }
  }

  private prepareProductData(): void {
    this.product.subCategoryId = this.selectedSubCategory?.id || 0;
    this.product.tags = this.selectedItems.map((tag) => new TagDTO(tag.name));
    this.product.packages = this.createPackages();
  }

  private createPackages(): ProductPackageRequestDTO[] {
    return ['BASIC', 'PREMIUM', 'DELUXE'].map((type, columnIndex) => {
      return this.createPackage(type, columnIndex);
    });
  }

  private createPackage(type: string, columnIndex: number): ProductPackageRequestDTO {
    const packageData: ProductPackageRequestDTO = new ProductPackageRequestDTO();
    packageData.type = type;
    packageData.attributes = [];

    this.rows.forEach((row) => {
      const columnValue = row.getValueByColumnIndex(columnIndex);

      if (this.isPackageRow(row)) {
        this.assignPackageValues(packageData, row, columnValue);
        return;
      }

      if (this.isAttributeValid(columnValue)) {
        const attribute: DynamicAttributeDTO = {
          key: row.servizio,
          value: columnValue
        };
        packageData.attributes.push(attribute);
      }
    });

    packageData.price = this.getRowValueFor('PREZZO', columnIndex) || 0;
    packageData.revisions = this.getRowValueFor('REVISIONI', columnIndex) || 0;
    packageData.deliveryTime = this.getRowValueFor('TEMPO DI CONSEGNA', columnIndex) || 0;

    return packageData;
  }

  private isPackageRow(row: TableRow): boolean {
    const packageRows = ['DESCRIZIONE', 'PREZZO', 'TEMPO DI CONSEGNA', 'REVISIONI'];
    return packageRows.includes(row.servizio.toUpperCase());
  }

  private assignPackageValues(packageData: ProductPackageRequestDTO, row: TableRow, columnValue: string | boolean): void {
    switch (row.servizio.toUpperCase()) {
      case 'DESCRIZIONE':
        packageData.description = typeof columnValue === 'boolean' ? (columnValue ? 'true' : 'false') : columnValue || '';
        break;
      case 'PREZZO':
        packageData.price = parseFloat(columnValue as string) || 0;
        break;
      case 'REVISIONI':
        packageData.revisions = columnValue ? parseInt(columnValue as string, 10) : 0;
        break;
      case 'TEMPO DI CONSEGNA':
        packageData.deliveryTime = columnValue ? parseInt(columnValue as string, 10) : 0;
        break;
      case 'SUPPORTO VIA EMAIL':
      default:
        break;
    }
  }

  private isAttributeValid(columnValue: string | boolean): boolean {
    return columnValue !== null && columnValue !== undefined && columnValue !== '';
  }

  private getRowValueFor(servizio: string, columnIndex: number): number | undefined {
    const row = this.rows.find((r) => r.servizio.toUpperCase() === servizio.toUpperCase());
    if (row) {
      return row.getValueByColumnIndex(columnIndex);
    }
    return undefined;
  }

  private isImagesValid(): boolean {
    return this.images && this.images.length > 0;
  }

  private submitProductData(): void {
    const formData = new FormData();
    formData.append('productRequestDTO', new Blob([JSON.stringify(this.product)], {type: 'application/json'}));
    this.images.forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.productService.createProduct(this.product, this.images).subscribe({
      next: (response) => {
        this.router.navigate(['/product'], {state: {productId: response.id}});
      },
      error: (error) => {
        console.error(error.message);
      }
    });
  }

  onFilesSelected(files: File[]): void {
    this.images = files;
  }

  private validateFields(): boolean {
    let errorMessages: string[] = [];

    if (!this.product.title || this.product.title.trim() === '') {
      errorMessages.push('Il titolo è obbligatorio.');
    }

    // Controllo della descrizione
    if (!this.product.description || this.product.description.trim() === '') {
      errorMessages.push('La descrizione è obbligatoria.');
    }

    if (!this.selectedMacroCategory) {
      errorMessages.push('La macrocategoria è obbligatoria.');
    }

    if (!this.selectedSubCategory) {
      errorMessages.push('La sottocategoria è obbligatoria.');
    }

    if (this.images.length === 0) {
      errorMessages.push('Le immagini sono obbligatorie.');
    }

    if (this.selectedItems.length === 0) {
      errorMessages.push('Almeno un tag è obbligatorio.');
    }

    if (!this.arePackagesValid()) {
      errorMessages.push('I pacchetti devono contenere almeno un attributo valido.');
    }

    if (errorMessages.length > 0) {
      if (errorMessages.length > 1) {
        this.messages = [{
          severity: 'error',
          summary: 'Errore',
          detail: 'Compila tutti i campi.',
        }];
      } else {
        this.messages = [{
          severity: 'error',
          summary: 'Errore',
          detail: errorMessages.join(' '),
        }];
      }

      this.messageService.addAll(this.messages);
      return false;
    }

    return true;
  }

  private arePackagesValid(): boolean {
    return this.product.packages.some((pkg) => {
      return pkg.attributes && pkg.attributes.length > 0;
    });
  }
}
