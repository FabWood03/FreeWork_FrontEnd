import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ContextMenu} from 'primeng/contextmenu';
import {UserService} from '../../services/user.service';
import {tap} from 'rxjs/operators';
import {UserResponseDTO} from '../../dto/response/user/UserResponseDTO';
import {ErrorUtils} from '../../util/ErrorUtils';
import {AnimationOptions} from 'ngx-lottie';
import {catchError} from 'rxjs';

@Component({
  selector: 'app-users-visualization',
  templateUrl: './users-visualization.component.html',
  styleUrl: './users-visualization.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UsersVisualizationComponent implements OnInit {
  items: MenuItem[] | undefined;
  searchText: string = '';
  @ViewChild('cm') cm!: ContextMenu;

  lottieConfigEmptyReview: AnimationOptions = this.getLottieConfig('emptyListPaper.json');

  private getLottieConfig(path: string, rendererSettings: any = {}): AnimationOptions {
    return {
      path: `assets/lottie/${path}`,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      rendererSettings,
    };
  }

  selectedUser!: UserResponseDTO | null;
  users: UserResponseDTO[] | undefined;
  admins: UserResponseDTO[] = [];
  moderators: UserResponseDTO[] = [];
  sellers: UserResponseDTO[] = [];
  buyers: UserResponseDTO[] = [];
  limitedAccounts: UserResponseDTO[] = [];

  constructor(private userService: UserService, private errorUtils: ErrorUtils) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

  onContextMenu(event: any, user: UserResponseDTO) {
    this.selectedUser = user;

    this.items = [
      {
        label: 'Ruolo',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Admin',
            command: () => {
              if (this.selectedUser) {
                this.changeRole('ADMIN');
              }
            }
          },
          {
            label: 'Moderatore',
            command: () => {
              if (this.selectedUser) {
                this.changeRole('MODERATOR');
              }
            }
          },
          {
            label: 'Venditore',
            command: () => {
              if (this.selectedUser) {
                this.changeRole('SELLER');
              }
            },
          },
          {
            label: 'Acquirente',
            command: () => {
              if (this.selectedUser) {
                this.changeRole('BUYER');
              }
            },
          },

        ]
      },
      {
        label: 'Limita Account',
        icon: 'pi pi-user-minus',
        visible: this.selectedUser?.active,
        command: () => {
          this.disableAccount();
        }
      },
      {
        label: 'Abilita account',
        icon: 'pi pi-user-plus',
        visible: !this.selectedUser?.active,
        command: () => {
          this.enableAccount();
        }
      }
    ];

    this.cm.show(event);
  }

  getAllUsers() {
    this.userService.getAllUsers().pipe(
      tap((users) => {
        this.users = users;
        this.admins = users.filter(user => user.role === 'ADMIN');
        this.moderators = users.filter(user => user.role === 'MODERATOR');
        this.sellers = users.filter(user => user.role === 'SELLER');
        this.buyers = users.filter(user => user.role === 'BUYER');
        this.limitedAccounts = users.filter(user => !user.active);
        users.forEach(user => user.role = this.translateRole(user.role));
      })
    ).subscribe();
  }

  changeRole(newRole: string) {
    if (!this.selectedUser) {
      this.errorUtils.showWarning('Nessun utente selezionato');
      return;
    }

    // Controlla se il ruolo è già assegnato
    if (this.selectedUser.role === this.translateRole(newRole)) {
      this.errorUtils.showWarning('L\'utente ha già il ruolo ' + this.translateRole(newRole));
      return;
    }

    const userId = this.selectedUser.id;

    this.userService.updateUserRole(userId, newRole).subscribe({
      next: (updatedUser) => {
        if (updatedUser && this.selectedUser) {
          this.selectedUser.role = updatedUser.role;
          this.selectedUser.role = this.translateRole(updatedUser.role);
          this.errorUtils.showSuccess("Ruolo cambiato con successo a " + this.selectedUser.role);

          // Aggiorna le liste
          this.removeFromLists(this.selectedUser);
          this.addToAppropriateList(this.selectedUser);
        }
      }
    });
  }

  disableAccount() {
    if (!this.selectedUser) {
      this.errorUtils.showWarning('Nessun utente selezionato');
      return;
    }

    if (!this.selectedUser.active) {
      this.errorUtils.showWarning('L\'utente ha già un account limitato');
      return;
    }

    this.userService.disableAccount(this.selectedUser.id).subscribe({
      next: () => {
        if (this.selectedUser) {
          this.selectedUser.active = false;

          // Aggiorna le liste
          this.removeFromLists(this.selectedUser);
          this.limitedAccounts.push(this.selectedUser);

          this.errorUtils.showSuccess('Account limitato con successo');
        }
      }
    });
  }

  enableAccount() {
    if (!this.selectedUser) {
      this.errorUtils.showWarning('Nessun utente selezionato');
      return;
    }

    if (this.selectedUser.active) {
      this.errorUtils.showWarning('L\'utente ha già un account abilitato');
      return;
    }

    this.userService.enableAccount(this.selectedUser.id).subscribe({
      next: () => {
        if (this.selectedUser) {
          this.selectedUser.active = true;

          // Aggiorna le liste
          this.removeFromLists(this.selectedUser);
          this.addToAppropriateList(this.selectedUser);

          this.errorUtils.showSuccess('Account abilitato con successo');
        }
      }
    });
  }

  private translateRole(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Amministratore';
      case 'MODERATOR':
        return 'Moderatore';
      case 'SELLER':
        return 'Venditore';
      case 'BUYER':
        return 'Acquirente';
      case 'LIMITED':
        return 'Account Limitato';
      default:
        return 'Ruolo non riconosciuto';
    }
  }

  private removeFromLists(user: UserResponseDTO) {
    this.admins = this.admins.filter(u => u.id !== user.id);
    this.moderators = this.moderators.filter(u => u.id !== user.id);
    this.sellers = this.sellers.filter(u => u.id !== user.id);
    this.buyers = this.buyers.filter(u => u.id !== user.id);
    this.limitedAccounts = this.limitedAccounts.filter(u => u.id !== user.id);
  }

  private addToAppropriateList(user: UserResponseDTO) {
    switch (user.role) {
      case 'Amministratore':
        this.admins.push(user);
        break;
      case 'Moderatore':
        this.moderators.push(user);
        break;
      case 'Venditore':
        this.sellers.push(user);
        break;
      case 'Acquirente':
        this.buyers.push(user);
        break;
      default:
        break;
    }
  }

  getAvatarUrl(imageFolderUrl: string | undefined): string {
    return this.userService.getAvatarUrl(imageFolderUrl);
  }

  getBadge(user: { role: string }): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (user.role === 'Moderatore') {
      return 'info';
    } else if (user.role === 'Amministratore') {
      return 'warning';
    } else if (user.role === 'Venditore') {
      return 'success';
    } else {
      return undefined;
    }
  }

  applyFilter() {
    const stringToSearch = this.searchText.trim();

    this.userService.getAllUsersFiltered(stringToSearch).pipe(
      tap((filteredUsers: UserResponseDTO[]) => {
        if (filteredUsers && Array.isArray(filteredUsers)) {
          this.users = filteredUsers;
          this.admins = filteredUsers.filter(user => user.role === 'ADMIN');
          this.moderators = filteredUsers.filter(user => user.role === 'MODERATOR');
          this.sellers = filteredUsers.filter(user => user.role === 'SELLER');
          this.buyers = filteredUsers.filter(user => user.role === 'BUYER');
          this.limitedAccounts = filteredUsers.filter(user => !user.active);
          filteredUsers.forEach(user => user.role = this.translateRole(user.role));
        } else {
          this.errorUtils.showWarning('Nessun utente trovato');
          this.users = [];
        }
      }),
      catchError((err) => {
        console.error(err);
        this.errorUtils.showError('Errore durante il filtraggio degli utenti');
        return [];
      })
    ).subscribe();
  }
}
