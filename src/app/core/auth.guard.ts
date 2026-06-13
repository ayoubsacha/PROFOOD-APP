import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserRole } from './api.models';
import { AuthService } from './auth.service';
import { landingPathForRole } from './role-landing';

export const activeAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.ensureProfile().pipe(
    map((user) => {
      if (user?.status === 'ACTIVE') {
        return true;
      }

      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }),
  );
};

export const loginRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.ensureProfile().pipe(
    map((user) => {
      if (user?.status === 'ACTIVE') {
        return router.createUrlTree([landingPathForRole(user.role)]);
      }

      return true;
    }),
  );
};

export const roleAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as UserRole[] | undefined;

  return auth.ensureProfile().pipe(
    map((user) => {
      if (user?.status !== 'ACTIVE') {
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }

      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        return router.createUrlTree([landingPathForRole(user.role)]);
      }

      return true;
    }),
  );
};
