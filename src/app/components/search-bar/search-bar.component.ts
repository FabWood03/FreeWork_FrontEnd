import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {
  @Output() searchTextChanged = new EventEmitter<string>();
  formGroup: FormGroup;
  suggestions: string[] = [];

  constructor() {
    this.formGroup = new FormGroup({
      selectedService: new FormControl('')
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = this.formGroup.get('selectedService')?.value;
      this.searchTextChanged.emit(value);
    }
  }

  search(event: any): void {
    const query = event.query;
    // Replace this with your actual search logic
    this.suggestions = this.getSuggestions(query);
  }

  getSuggestions(query: string): string[] {
    // Replace this with your actual suggestion fetching logic
    const allSuggestions = ['Service 1', 'Service 2', 'Service 3'];
    return allSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
  }
}
