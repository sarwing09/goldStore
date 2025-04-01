import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';



// validar-token.guard.ts
export const validarTokenGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigateByUrl('/auth', { replaceUrl: true });
    return false;
  }

  return authService.validarToken().pipe(
    map(valid => {
      if (!valid) {
        router.navigateByUrl('/auth', { replaceUrl: true });
      }
      return valid;
    }),
    catchError(() => {
      router.navigateByUrl('/auth', { replaceUrl: true });
      return of(false);
    })
  );
};


export const validarTokenGuard2: CanMatchFn = (route, segments) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('CanMatch')
  return authService.validarToken()
    .pipe(
      tap(valid => {
        if (!valid) {
          router.navigateByUrl('/auth/login');
        }
      })
    );


};
