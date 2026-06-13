import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { landingPathForRole } from '../../core/role-landing';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = {
    email: '',
    password: '',
  };
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected submit(): void {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.form).subscribe({
      next: (session) => {
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || landingPathForRole(session.user.role);
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.error.set(error?.error?.message || 'Connexion impossible.');
        this.loading.set(false);
      },
    });
  }
}
