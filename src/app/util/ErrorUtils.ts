import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtils {

  private static errorShown: { [key: string]: boolean } = {};

  constructor(private messageService: MessageService) {
  }

  showHttpError(error: HttpErrorResponse, context: string): void {
    const errorKey = `${error.status}-${error.error?.status}`;

    if (ErrorUtils.errorShown[errorKey]) {
      return;
    }

    ErrorUtils.errorShown[errorKey] = true;

    if (error.error.status === 200 || error.error.status === 201) {
      this.showSuccess('L\'operazione è stata eseguita con successo.');
    }

    if (error.status === 400) {
      if (typeof error.error.message === 'string') {
        this.showError(error.error.message);
      } else if (typeof error.error.message === 'object') {
        this.showError(this.extractErrorMessages(error.error.message));
      } else {
        this.showError('I dati inviati non sono validi. Controlla i campi e riprova.');
      }
    }

    if (error.status === 401) {
      this.showError('La tua sessione è scaduta. Effettua nuovamente il login.');
    }

    if (error.status === 403) {
      this.showError('Non hai i permessi necessari per accedere a questa risorsa.');
    }

    if (error.status === 404) {
      this.showError('La risorsa richiesta non è stata trovata.');
    }

    if (error.status === 409) {
      this.showError('Esiste già un elemento con le stesse informazioni.');
    }

    if (error.status === 500) {
      this.showError('Si è verificato un errore interno. Riprova più tardi.');
    }

    if (error.status === 0) {
      this.showError('Impossibile connettersi al server.');
    }

    if (error.status === undefined) {
      console.error();
    }

    console.error();
  }

  private extractErrorMessages(errorMessages: any): string {
    if (typeof errorMessages === 'object') {
      return Object.entries(errorMessages)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return 'Si è verificato un errore sconosciuto.';
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: message,
      life: 4000
    });
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Successo',
      detail: message,
      life: 3000
    });
  }

  showWarning(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Avviso',
      detail: message,
      life: 4000
    });
  }

  showInfo(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Informazione',
      detail: message,
      life: 5000
    });
  }
}
