import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FilterStateService {
  private searchTextSource = new BehaviorSubject<string>('');
  private subcategorySource = new BehaviorSubject<number | null>(null);

  currentSearchText = this.searchTextSource.asObservable();
  currentSubcategory = this.subcategorySource.asObservable();

  setSearchText(searchText: string) {
    this.searchTextSource.next(searchText);
  }

  setSubcategory(subcategoryId: number | null) {
    this.subcategorySource.next(subcategoryId);
  }
}
