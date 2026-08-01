import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerifyComponent } from './otp-verify.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

describe('OtpVerifyComponent', () => {
  let component: OtpVerifyComponent;
  let fixture: ComponentFixture<OtpVerifyComponent>;
  let authHttpMock: any;
  let authStoreMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    authHttpMock = {
      verifyCode: vi.fn().mockReturnValue(of({ user: { id: '1', email: 'test@example.com' } })),
      refreshCode: vi.fn().mockReturnValue(of({ success: true }))
    };
    authStoreMock = {
      setAuthenticatedUser: vi.fn()
    };
    snackBarMock = {
      open: vi.fn()
    };

    // Set value in sessionStorage
    sessionStorage.setItem('pending_user_id', 'test-user-id');

    await TestBed.configureTestingModule({
      imports: [OtpVerifyComponent, ReactiveFormsModule],
      providers: [
        provideRouter([{ path: 'dashboard', component: {} as any }, { path: 'auth/register', component: {} as any }, { path: 'auth/verify-code', component: {} as any }]),
        provideAnimationsAsync(),
        { provide: AuthHttpService, useValue: authHttpMock },
        { provide: AuthStoreService, useValue: authStoreMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.otpForm.invalid).toBe(true);
  });

  it('should have a valid form when filled correctly', () => {
    component.otpForm.setValue({
      code: '123456'
    });
    expect(component.otpForm.valid).toBe(true);
  });

  it('should call authHttp.verifyCode on submit', () => {
    component.otpForm.setValue({
      code: '123456'
    });
    component.onSubmit();
    expect(authHttpMock.verifyCode).toHaveBeenCalledWith({
      userId: 'test-user-id',
      code: '123456'
    });
  });
});
