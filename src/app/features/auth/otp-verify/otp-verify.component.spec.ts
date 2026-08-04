import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerifyComponent } from './otp-verify.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { Router, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('OtpVerifyComponent', () => {
  let component: OtpVerifyComponent;
  let fixture: ComponentFixture<OtpVerifyComponent>;
  let router: Router;
  let navigateSpy: any;
  let snackBarOpenSpy: any;
  
  let authHttpSpy: any;
  let authStoreSpy: any;
  
  let mockHasActiveRegistration: boolean;
  let mockUserId: string | null;
  let mockUsername: string | null;
  let mockPassword: string | null;
  let registrationStateMock: any;

  beforeEach(async () => {
    authHttpSpy = {
      verifyCode: vi.fn().mockReturnValue(of({ userId: 'user123', username: 'test@example.com' })),
      login: vi.fn().mockReturnValue(of({ user: { id: 'user123', username: 'test@example.com' } })),
      refreshCode: vi.fn().mockReturnValue(of({}))
    };
    authStoreSpy = {
      fetchUser: vi.fn().mockReturnValue(of({ user: { id: 'user123', username: 'test@example.com' } }))
    };

    mockHasActiveRegistration = true;
    mockUserId = 'user123';
    mockUsername = 'test@example.com';
    mockPassword = 'password123';
    
    registrationStateMock = {
      hasActiveRegistration: () => mockHasActiveRegistration,
      userId: () => mockUserId,
      username: () => mockUsername,
      maskedUsername: signal('t***@example.com'),
      getPasswordForAutoLogin: () => mockPassword,
      clear: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OtpVerifyComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthHttpService, useValue: authHttpSpy },
        { provide: AuthStoreService, useValue: authStoreSpy },
        { provide: RegistrationStateService, useValue: registrationStateMock }
      ]
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(OtpVerifyComponent);
    component = fixture.componentInstance;
    
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    snackBarOpenSpy = vi.spyOn(snackBar, 'open').mockImplementation(() => ({} as any));

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  }

  it('should redirect to /auth/register if no active registration session on init', () => {
    mockHasActiveRegistration = false;
    createComponent();
    
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Registration session expired. Please register again.', 'Close', { duration: 5000 });
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/register']);
  });

  describe('when active registration exists', () => {
    it('should start countdown timer on init', () => {
      vi.useFakeTimers();
      mockHasActiveRegistration = true;
      createComponent();
      
      expect(component.resendCooldown()).toBe(60);
      
      vi.advanceTimersByTime(1000);
      expect(component.resendCooldown()).toBe(59);
      
      vi.advanceTimersByTime(59000);
      expect(component.resendCooldown()).toBe(0);
      
      component.ngOnDestroy();
      vi.useRealTimers();
    });

    it('should verify code successfully', () => {
      vi.useFakeTimers();
      mockHasActiveRegistration = true;
      createComponent();

      authHttpSpy.verifyCode.mockReturnValue(of({ userId: 'user123', username: 'test@example.com' }));
      authHttpSpy.login.mockReturnValue(of({ user: { id: 'user123', username: 'test@example.com' } }));

      component.onCodeComplete('123456');

      expect(authHttpSpy.verifyCode).toHaveBeenCalledWith({ userId: 'user123', code: '123456' });
      
      vi.advanceTimersByTime(2500);
      vi.useRealTimers();
    });

    it('should show error if verification fails', () => {
      vi.useFakeTimers();
      mockHasActiveRegistration = true;
      createComponent();

      authHttpSpy.verifyCode.mockReturnValue(throwError(() => ({ error: { message: 'Invalid code' } })));
      
      component.otpInput = {
        reset: vi.fn()
      } as any;
      
      component.onCodeComplete('000000');
      
      expect(authHttpSpy.verifyCode).toHaveBeenCalled();
      expect(component.hasError()).toBe(true);
      expect(snackBarOpenSpy).toHaveBeenCalledWith('Invalid code', 'Close', { duration: 4000 });
      
      vi.advanceTimersByTime(600);
      expect(component.otpInput.reset).toHaveBeenCalled();
      expect(component.hasError()).toBe(false);
      vi.useRealTimers();
    });
  });
});
