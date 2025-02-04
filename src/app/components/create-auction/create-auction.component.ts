import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {SubCategoryResponseDTO} from '../../dto/response/category/SubCategoryResponseDTO';
import {CategoryService} from '../../services/category.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuctionValidators} from '../../util/AuctionValidators';
import {AuctionService} from '../../services/auction.service';
import {AuctionRequestDTO} from '../../dto/request/auction/AuctionRequestDTO';
import {AuctionDetailsDTO} from '../../dto/response/auction/AuctionDetailsDTO';
import {Router} from '@angular/router';
import {AuctionDateUtils} from '../../util/AuctionDateUtils';
import {ErrorUtils} from '../../util/ErrorUtils';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrl: './create-auction.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateAuctionComponent implements OnInit {
  minStartDate: Date | undefined;
  minEndDate: Date | undefined;
  filteredSubCategories: SubCategoryResponseDTO[] = [];
  auctionForm: FormGroup;
  auctionData: AuctionRequestDTO = new AuctionRequestDTO();
  selectedSubCategory: SubCategoryResponseDTO | null = null;
  categories: { label: string; subcategories: SubCategoryResponseDTO[] }[] = [];

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private router: Router,
    private errorUtils: ErrorUtils
  ) {
    this.auctionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
      macroCategory: [null, Validators.required],
      subCategory: [{value: null, disabled: true}, Validators.required],
      startAuctionDate: [null, Validators.required],
      endAuctionDate: [{value: null, disabled: true}, Validators.required],
      deliveryDate: [0, Validators.min(1)],
    }, {
      validators: [AuctionValidators.validAuctionDates()]
    });
  }

  ngOnInit(): void {
    this.minStartDate = new Date();
    this.loadCategories();
    this.checkShowEndDate();
  }

  checkShowEndDate() {
    this.auctionForm.get('macroCategory')?.valueChanges.subscribe(value => {
      const subCategoryControl = this.auctionForm.get('subCategory');
      if (value) {
        subCategoryControl?.enable();
      } else {
        subCategoryControl?.disable();
      }
      subCategoryControl?.updateValueAndValidity();
    });

    this.auctionForm.get('startAuctionDate')?.valueChanges.subscribe(value => {
      const closingDateControl = this.auctionForm.get('endAuctionDate');
      if (value) {
        closingDateControl?.enable();
      } else {
        closingDateControl?.disable();
      }
      closingDateControl?.updateValueAndValidity();
    });
  }

  lottieConfigAuctionHammer: AnimationOptions = this.getLottieConfig('auctionHammer.json');

  private getLottieConfig(path: string, rendererSettings: any = {}): AnimationOptions {
    return {
      path: `assets/lottie/${path}`,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      rendererSettings,
    };
  }

  private loadCategories(): void {
    this.categoryService.getSubcategoriesWithMacroCategory().subscribe((subcategories) => {
      this.categories = SubCategoryResponseDTO.mapCategories(subcategories);
    });
  }

  onMacroCategoryChange(selectedCategory: { label: string; subcategories: SubCategoryResponseDTO[] }): void {
    this.updateSubCategories(selectedCategory);
  }

  private updateSubCategories(selectedCategory: { label: string; subcategories: SubCategoryResponseDTO[] }): void {
    this.filteredSubCategories = selectedCategory ? selectedCategory.subcategories : [];
    this.selectedSubCategory = null;
  }

  onSubmit(): void {
    if (this.auctionForm.invalid) {
      this.errorUtils.showError('Compilare tutti i campi obbligatori.');
      return;
    }

    this.auctionData = AuctionRequestDTO.fromAuctionRequestDTO(this.auctionForm.value);

    this.auctionService.createAuction(this.auctionData).subscribe({
      next: (response: AuctionDetailsDTO) => {
        this.errorUtils.showSuccess('Asta creata con successo.');
        this.errorUtils.showInfo('Verrai reindirizzato alla pagina dell\'asta.');
        setTimeout(() => {
          this.router.navigate(['/auction'], {state: {auctionId: response.id}});
        }, 3000);
      },
      error: (error) => {
        this.errorUtils.showHttpError(error, 'onSubmit');
      }
    });
  }

  onStartDateSelect(event: any): void {
    const startDate = event.value;
    this.minEndDate = AuctionDateUtils.setMinEndDate(startDate);
  }
}
