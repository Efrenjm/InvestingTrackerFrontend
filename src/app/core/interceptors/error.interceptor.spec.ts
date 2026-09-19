import '@angular/compiler';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { describe, expect, it, vi } from 'vitest';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { handleApiError } from './error.interceptor';

describe('errorInterceptor', () => {
  it('shows the backend detail without redirecting and rethrows the error', () => {
    const notification = { error: vi.fn() };
    const request = new HttpRequest<unknown>('POST', '/auth/login', null);
    const backendError = new HttpErrorResponse({
      status: 401,
      error: { code: 'INVALID_CREDENTIALS', detail: 'Invalid user/password combination.' },
    });

    handleApiError(notification as unknown as NotificationService, request, () => throwError(() => backendError))
      .subscribe({
        error: (error: HttpErrorResponse) => expect(error).toBe(backendError),
      });

    expect(notification.error).toHaveBeenCalledWith('Invalid user/password combination.');
  });
});
