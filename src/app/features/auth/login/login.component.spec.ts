import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authHttpMock: any;
  let authStoreMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    authHttpMock = {
      login: vi.fn().mockReturnValue(of(undefined)),
      getCurrentUser: vi.fn().mockReturnValue(of({ user: { id: '1', email: 'test@example.com' } }))
    };

    authStoreMock = {
      fetchUser: vi.fn().mockReturnValue(of({ user: { id: '1', email: 'test@example.com' } })),
      setAuthenticatedUser: vi.fn()
    };
    snackBarMock = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([{ path: 'dashboard', component: {} as any }, { path: 'auth/register', component: {} as any }, { path: 'auth/verify-code', component: {} as any }, ]),
        provideAnimationsAsync(),
        { provide: AuthHttpService, useValue: authHttpMock },
        { provide: AuthStoreService, useValue: authStoreMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should have a valid form when filled correctly', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should call authHttp.login on submit', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    component.onSubmit();
    expect(authHttpMock.login).toHaveBeenCalledWith({
      username: 'test@example.com',
      password: 'password123'
    });
  });

  it('should call fetchUser after successful login', () => {
     component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    component.onSubmit();
    expect(authStoreMock.fetchUser).toHaveBeenCalled();
  });
});
