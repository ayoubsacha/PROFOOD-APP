import { UserRole } from './api.models';

export function landingPathForRole(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'FOURNISSEUR':
      return '/fournisseur/dashboard';
    case 'CLIENT_PRO':
    default:
      return '/home';
  }
}
