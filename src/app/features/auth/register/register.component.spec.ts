import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { Router, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let navigateSpy: any;
  let snackBarOpenSpy: any;
  
  let authHttpSpy: any;
  let registrationStateSpy: any;

  beforeEach(async () => {
    authHttpSpy = {
      register: vi.fn().mockReturnValue(of({ userId: '123', username: 'test@example.com' }))
    };
    registrationStateSpy = {
      setRegistrationData: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthHttpService, useValue: authHttpSpy },
        { provide: RegistrationStateService, useValue: registrationStateSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    snackBarOpenSpy = vi.spyOn(snackBar, 'open').mockImplementation(() => ({} as any));
    
    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should validate email field (required and valid format)', () => {
    const emailControl = component.registerForm.get('email');
    
    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('invalidemail');
    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.get('email')?.setValue('');
    
    component.onSubmit();
    
    expect(authHttpSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthHttpService.register, store data, and navigate on success', () => {
    const email = 'test@example.com';
    
    component.registerForm.get('email')?.setValue(email);
    
    const mockResponse = { userId: '123', username: email };
    authHttpSpy.register.mockReturnValue(of(mockResponse));
    
    component.onSubmit();
    
    expect(authHttpSpy.register).toHaveBeenCalledWith({ email });
    expect(registrationStateSpy.setRegistrationData).toHaveBeenCalledWith('123', email, '');
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/verify-code']);
    expect(component.isLoading()).toBe(false);
  });

  it('should show snackbar on registration error', () => {
    const email = 'test@example.com';
    
    component.registerForm.get('email')?.setValue(email);
    
    authHttpSpy.register.mockReturnValue(throwError(() => ({ error: { message: 'Registration failed' } })));
    
    component.onSubmit();
    
    expect(authHttpSpy.register).toHaveBeenCalledWith({ email });
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Registration failed', 'Close', { duration: 5000 });
    expect(component.isLoading()).toBe(false);
  });
});
