import { HttpContextToken, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { getApiErrorMessage } from '../errors/api-error.mapper';
import { NotificationService } from '../services/notification.service';

export const SILENT_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return handleApiError(notifications, req, next);
};

export function handleApiError(
  notifications: NotificationService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!req.context.get(SILENT_ERROR_NOTIFICATION)) {
        notifications.error(getApiErrorMessage(error, 'An unexpected error occurred. Please try again.'));
      }
      return throwError(() => error);
    })
  );
};
