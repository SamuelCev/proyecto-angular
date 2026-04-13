import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { map } from 'rxjs/operators';

export const publicGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    })
  );
};
