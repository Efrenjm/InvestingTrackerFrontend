import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { Router, provideRouter } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let navigateSpy: any;
  let notificationErrorSpy: any;
  let notificationSuccessSpy: any;
  
  let authHttpSpy: any;
  let registrationStateSpy: any;

  beforeEach(async () => {
    authHttpSpy = {
      register: vi.fn().mockReturnValue(of({
        userId: '123',
        username: 'test@example.com',
        message: 'You’re almost there! Check your inbox for the next steps.'
      }))
    };
    registrationStateSpy = {
      setRegistrationData: vi.fn()
    };
    notificationErrorSpy = vi.fn();
    notificationSuccessSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthHttpService, useValue: authHttpSpy },
        { provide: RegistrationStateService, useValue: registrationStateSpy },
        { provide: NotificationService, useValue: { error: notificationErrorSpy, success: notificationSuccessSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
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

  it('should require a strong matching password', () => {
    component.registerForm.get('email')?.setValue('valid@example.com');
    component.registerForm.get('password')?.setValue('Password1@');
    component.registerForm.get('confirmPassword')?.setValue('Different1@');

    component.onSubmit();

    expect(authHttpSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthHttpService.register, store data, and navigate on success', () => {
    const email = 'test@example.com';
    const password = 'Password1@';
    
    component.registerForm.get('email')?.setValue(email);
    component.registerForm.get('password')?.setValue(password);
    component.registerForm.get('confirmPassword')?.setValue(password);
    
    const mockResponse = {
      userId: '123',
      username: email,
      message: 'You’re almost there! Check your inbox for the next steps.'
    };
    authHttpSpy.register.mockReturnValue(of(mockResponse));
    
    component.onSubmit();
    
    expect(authHttpSpy.register).toHaveBeenCalledWith({ email, password });
    expect(registrationStateSpy.setRegistrationData).toHaveBeenCalledWith('123', email);
    expect(notificationSuccessSpy).toHaveBeenCalledWith('You’re almost there! Check your inbox for the next steps.');
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/verify-code']);
    expect(component.isLoading()).toBe(false);
  });

  it('should show an error notification on registration error', () => {
    const email = 'test@example.com';
    const password = 'Password1@';
    
    component.registerForm.get('email')?.setValue(email);
    component.registerForm.get('password')?.setValue(password);
    component.registerForm.get('confirmPassword')?.setValue(password);
    
    authHttpSpy.register.mockReturnValue(throwError(() => ({ error: { message: 'Registration failed' } })));
    
    component.onSubmit();
    
    expect(authHttpSpy.register).toHaveBeenCalledWith({ email, password });
    expect(notificationErrorSpy).toHaveBeenCalledWith('An error occurred during registration');
    expect(component.isLoading()).toBe(false);
  });
});
