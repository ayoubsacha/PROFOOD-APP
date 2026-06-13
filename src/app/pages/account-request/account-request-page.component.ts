import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AccountRequestPayload,
  AccountRequestService,
} from '../../core/account-request.service';

@Component({
  selector: 'app-account-request-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './account-request-page.component.html',
  styleUrl: './account-request-page.component.scss',
})
export class AccountRequestPageComponent {
  private readonly accountRequest = inject(AccountRequestService);

  protected readonly form: AccountRequestPayload = {
    name: '',
    email: '',
    requestedRole: 'CLIENT_PRO',
    companyName: '',
    phone: '',
    address: '',
    message: '',
  };
  protected readonly loading = signal(false);
  protected readonly message = signal('');
  protected readonly error = signal('');

  protected submit(): void {
    this.loading.set(true);
    this.message.set('');
    this.error.set('');

    this.accountRequest.submit(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.message.set('Demande envoyee. Vous serez notifie apres validation admin.');
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error?.error?.message || "La demande n'a pas pu etre envoyee.");
      },
    });
  }
}
