import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  info(message: string, duration = 4000) {
    this.show(message, 'info', duration);
  }

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  private show(message: string, type: NotificationType, duration: number) {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['notification-toast', `notification-toast--${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };

    this.snackBar.open(message, 'Close', config);
  }
}
