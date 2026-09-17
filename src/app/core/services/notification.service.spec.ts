import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { describe, expect, it, vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  it('shows a success toast with its semantic styling and default options', () => {
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: { open } },
      ],
    });

    TestBed.inject(NotificationService).success('Saved successfully');

    expect(open).toHaveBeenCalledWith('Saved successfully', 'Close', {
      duration: 4000,
      panelClass: ['notification-toast', 'notification-toast--success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  });

  it.each([
    ['info', 'notification-toast--info'],
    ['warning', 'notification-toast--warning'],
    ['error', 'notification-toast--error'],
  ] as const)('maps %s notifications to their semantic class', (type, panelClass) => {
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: { open } },
      ],
    });

    TestBed.inject(NotificationService)[type]('Message');

    expect(open).toHaveBeenCalledWith('Message', 'Close', expect.objectContaining({
      panelClass: ['notification-toast', panelClass],
    }));
  });

  it('uses five seconds as the default duration for errors', () => {
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: { open } },
      ],
    });

    TestBed.inject(NotificationService).error('Something went wrong');

    expect(open).toHaveBeenCalledWith('Something went wrong', 'Close', expect.objectContaining({
      duration: 5000,
    }));
  });
});
