import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetPasswordComponent } from './set-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { Router, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;
  let router: Router;
  let navigateSpy: any;
  let snackBarOpenSpy: any;

  let authHttpSpy: any;
  let authStoreSpy: any;
  let registrationStateSpy: any;

  beforeEach(async () => {
    authHttpSpy = {
      updatePassword: vi.fn().mockReturnValue(of({})),
      login: vi.fn().mockReturnValue(of({ user: { id: '123', username: 'test@example.com' } }))
    };
    authStoreSpy = {
      setAuthenticatedUser: vi.fn()
    };
    registrationStateSpy = {
      username: signal('test@example.com'),
      clear: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SetPasswordComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthHttpService, useValue: authHttpSpy },
        { provide: AuthStoreService, useValue: authStoreSpy },
        { provide: RegistrationStateService, useValue: registrationStateSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SetPasswordComponent);
    component = fixture.componentInstance;

    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    snackBarOpenSpy = vi.spyOn(snackBar, 'open').mockImplementation(() => ({} as any));

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should validate password complexity requirements', () => {
    const control = component.newPasswordControl;

    control.setValue('weak');
    expect(control.valid).toBe(false);

    control.setValue('Password123!');
    expect(control.valid).toBe(true);
  });

  it('should require confirmPassword to match newPassword', () => {
    component.passwordForm.setValue({
      newPassword: 'Password123!',
      confirmPassword: 'DifferentPassword123!'
    });

    expect(component.passwordsMatch).toBe(false);

    component.passwordForm.setValue({
      newPassword: 'Password123!',
      confirmPassword: 'Password123!'
    });

    expect(component.passwordsMatch).toBe(true);
  });

  it('should submit password update, auto-login, and navigate to /dashboard', () => {
    const password = 'Password123!';
    component.passwordForm.setValue({
      newPassword: password,
      confirmPassword: password
    });

    component.onSubmit();

    expect(authHttpSpy.updatePassword).toHaveBeenCalledWith({
      newPassword: password
    });
    expect(authHttpSpy.login).toHaveBeenCalledWith({
      username: 'test@example.com',
      password: password
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    expect(registrationStateSpy.clear).toHaveBeenCalled();
  });

  it('should handle updatePassword error gracefully', () => {
    authHttpSpy.updatePassword.mockReturnValue(throwError(() => ({ error: { message: 'Password update failed' } })));

    const password = 'Password123!';
    component.passwordForm.setValue({
      newPassword: password,
      confirmPassword: password
    });

    component.onSubmit();

    expect(snackBarOpenSpy).toHaveBeenCalledWith('Password update failed', 'Close', { duration: 5000 });
    expect(component.isLoading()).toBe(false);
  });
});
