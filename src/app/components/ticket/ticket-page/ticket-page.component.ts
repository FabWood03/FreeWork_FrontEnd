import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TicketService} from '../../../services/ticket.service';
import {TicketResponseDTO} from '../../../dto/response/ticket/TicketResponseDTO';
import {UserService} from '../../../services/user.service';
import {AnimationOptions} from 'ngx-lottie';
import {Router} from '@angular/router';
import {ErrorUtils} from '../../../util/ErrorUtils';

@Component({
  selector: 'app-ticket-page',
  templateUrl: './ticket-page.component.html',
  styleUrls: ['./ticket-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TicketPageComponent implements OnInit {
  ticketData!: TicketResponseDTO;
  ticketStatus: any;
  ticketDescription: any;
  isLoading: boolean = true;  // Variabile per gestire lo stato di caricamento
  lottieConfigLoadingPage: AnimationOptions = this.getLottieConfig('loadingPage.json');

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private router: Router,
    private errorUtils: ErrorUtils
  ) {
  }

  ngOnInit() {
    this.initializeSingleTicketData();
  }

  private initializeSingleTicketData(): void {
    const navigation = history.state;

    if (navigation && navigation.ticketId) {
      const ticketId = navigation.ticketId as number;

      this.loadTicketData(ticketId);
    } else {
      this.errorUtils.showError('Impossibile caricare i dati del ticket, nessun ID trovato nei dati di navigazione.');
      this.isLoading = false;
    }
  }

  loadTicketData(ticketId: number): void {
    this.ticketService.getTicketById(ticketId).subscribe({
      next: (data) => {
        this.ticketData = TicketResponseDTO.fromTicketDTO(data);
        this.setLoadingState();
      },
      error: (error) => {
        console.error(error);
        this.setLoadingState();
      }
    });
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  private getLottieConfig(path: string, rendererSettings: any = {}): AnimationOptions {
    return {
      path: `assets/lottie/${path}`,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      rendererSettings,
    };
  }


  private setLoadingState(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onSubmitResponse() {
    if (this.ticketStatus === '') {
      this.errorUtils.showError('Seleziona uno stato per il ticket');
      return;
    }

    if (this.ticketStatus === 'Accettato') {
      this.ticketService.acceptTicket(this.ticketData.id, this.ticketDescription).subscribe({
        next: () => {
          this.errorUtils.showSuccess('Ticket accettato con successo');
          this.router.navigate(['/tickets']);
        }
      });
    } else if (this.ticketStatus === 'Rifiutato') {
      this.ticketService.refuseTicket(this.ticketData.id, this.ticketDescription).subscribe({
        next: () => {
          this.errorUtils.showSuccess('Ticket rifiutato con successo');
          this.router.navigate(['/tickets']);
        }
      });
    }
  }

  goToTickets() {
    this.router.navigate(['/tickets']);
  }
}
