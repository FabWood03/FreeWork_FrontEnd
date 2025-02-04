import {Component, Input, ViewEncapsulation} from '@angular/core';
import {TicketResponseDTO} from '../../../dto/response/ticket/TicketResponseDTO';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {TicketService} from '../../../services/ticket.service';
import {ErrorUtils} from '../../../util/ErrorUtils';

@Component({
  selector: 'app-single-ticket',
  templateUrl: './single-ticket.component.html',
  styleUrls: ['./single-ticket.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SingleTicketComponent {
  @Input() singleTicket!: TicketResponseDTO;

  constructor(
    private userService: UserService,
    private router: Router,
    private ticketService: TicketService,
    private errorUtils: ErrorUtils
  ) {
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  goToSingleTicketPage(ticketId: number) {
    if (this.singleTicket.state === 'In attesa') {
      this.ticketService.changeTakeOnState(this.singleTicket.id).subscribe({
        next: () => {
          this.router.navigate(['/ticketPage'], {state: {ticketId: ticketId}});
          this.errorUtils.showSuccess('Lo stato del ticket è stato cambiato con successo.');
        },
      });
    } else {
      this.router.navigate(['/ticketPage'], {state: {ticketId: ticketId}});
    }
  }

  goToSellerProfile(userId: number): void {
    this.router.navigate(['/sellerProfile'], {state: {userId: userId}});
  }
}
