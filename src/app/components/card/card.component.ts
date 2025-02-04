import {Component, Input} from '@angular/core';
import {CardResponseDTO} from '../../dto/response/CardResponseDTO';
import {environment} from '../../../environment';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() card!: CardResponseDTO;
  @Input() cardType: "auctionCard" | "serviceCard" | "OtherUserProfileAuctionCard" | "OtherUserProfileCard" | undefined;
  apiBaseUrl = environment.apiBaseUrl;

  constructor(private router: Router, private userService: UserService) {
  }

  goToSellerProfile(userId: number): void {
    this.router.navigate(['/sellerProfile'], {state: {userId: userId}});
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }
}
