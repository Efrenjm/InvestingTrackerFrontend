import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        // Redirigir al login si no está autorizado
        // El AuthStoreService se encargará de limpiar el estado
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
