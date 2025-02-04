export class TableRow {
  servizio: string;
  base: string | boolean;
  premium: string | boolean;
  deluxe: string | boolean;
  isEditable: boolean;
  type: 'text' | 'checkbox' | 'integer' | 'decimal';

  constructor(
    servizio: string = '',
    base: string | boolean = '',
    premium: string | boolean = '',
    deluxe: string | boolean = '',
    isEditable: boolean = false,
    type: 'text' | 'checkbox' | 'integer' | 'decimal' = 'text'
  ) {
    this.servizio = servizio;
    this.base = base;
    this.premium = premium;
    this.deluxe = deluxe;
    this.isEditable = isEditable;
    this.type = type;
  }

  static createDefault(type: 'text' | 'checkbox' | 'integer' = 'text'): TableRow {
    const defaultValue = type === 'text' ? '' : false;
    return new TableRow('', defaultValue, defaultValue, defaultValue, true, type);
  }

  getValueByColumnIndex(columnIndex: number): any {
    switch (columnIndex) {
      case 0:
        return this.base;
      case 1:
        return this.premium;
      case 2:
        return this.deluxe;
      default:
        return null;
    }
  }
}

