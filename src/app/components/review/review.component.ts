import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReviewResponseDTO} from '../../dto/response/review/ReviewResponseDTO';
import {environment} from '../../../environment';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {TicketService} from '../../services/ticket.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {
  @Input() review!: ReviewResponseDTO;
  apiBaseUrl = environment.apiBaseUrl;

  isPreviewVisible: boolean = false;
  previewImage: string = '';

  visible: boolean = false;
  selectedReviewId?: number;
  isReviewOwner: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private ticketService: TicketService,
  ) {}

  ngOnInit() {
    const loggedInUserEmail = this.authService.getUserLoggedEmail();
    this.isReviewOwner = this.review.user.email === loggedInUserEmail;
  }

  getImageUrls(paths: string[]): string[] {
    return paths.map(path => this.apiBaseUrl + path);
  }

  openPreview(image: string): void {
    this.previewImage = image;  // Imposta l'immagine da visualizzare
    this.isPreviewVisible = true;  // Mostra la finestra modale
  }

  closePreview(): void {
    this.isPreviewVisible = false;  // Nasconde la finestra modale
    this.previewImage = '';         // Reset dell'immagine in anteprima
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  toggleDialog(reviewId: number) {
    this.visible = !this.visible;
    this.selectedReviewId = reviewId;
  }

  goToSellerProfile(userId: number): void {
    this.router.navigate(['/sellerProfile'], { state: { userId } });
  }

  handleReportSubmit(data: { title: string, description: string, reviewId?: number }) {
    const ticketRequestDTO = {
      title: data.title,
      description: data.description,
      reportedReviewId: data.reviewId ?? 0
    };

    this.ticketService.reportReview(ticketRequestDTO).subscribe({
      next: () => {
        this.visible = false;
      },
      error: (error: any) => {
        this.visible = false;
        console.error(error);
      }
    });
  }
}
