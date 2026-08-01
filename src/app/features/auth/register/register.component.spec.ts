import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authHttpMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    authHttpMock = {
      register: vi.fn().mockReturnValue(of({ userId: '1' }))
    };
    snackBarMock = {
      open: vi.fn()
    };

    // Mock sessionStorage
    vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideRouter([{ path: 'dashboard', component: {} as any }, { path: 'auth/register', component: {} as any }, { path: 'auth/verify-code', component: {} as any }, ]),
        provideAnimationsAsync(),
        { provide: AuthHttpService, useValue: authHttpMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.registerForm.invalid).toBe(true);
  });

  it('should have a valid form when filled correctly', () => {
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.registerForm.valid).toBe(true);
  });

  it('should call authHttp.register on submit', () => {
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123'
    });
    component.onSubmit();
    expect(authHttpMock.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
