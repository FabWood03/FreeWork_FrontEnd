import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class AuctionValidators {

  static validAuctionDates(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('startAuctionDate')?.value;
      const end = group.get('endAuctionDate')?.value;

      if (!start || !end) {
        return {missingDates: 'Le date di inizio e fine dell\'asta sono obbligatorie.'};
      }

      const startDate = new Date(start);
      const endDate = new Date(end);
      const now = new Date();

      const errors: ValidationErrors = {};

      if (startDate.getTime() === endDate.getTime()) {
        errors['sameDates'] = 'La data di inizio e fine non possono coincidere.';
      }

      if (startDate < now) {
        errors['startDateInPast'] = 'La data di inizio dell\'asta non può essere nel passato.';
      }

      if (endDate < startDate) {
        errors['endDateBeforeStartDate'] = 'La data di fine deve essere successiva alla data di inizio.';
      }

      if (endDate < now) {
        errors['endDateInPast'] = 'La data di fine deve essere nel futuro.';
      }

      const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      if (durationInHours < 24) {
        errors['insufficientDuration'] = 'La durata dell\'asta deve essere di almeno 24 ore.';
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
}
