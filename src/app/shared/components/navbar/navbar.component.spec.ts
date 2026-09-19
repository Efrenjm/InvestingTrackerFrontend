import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { User } from '../../../core/models/auth.models';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let authStoreMock: {
    user: ReturnType<typeof signal<User | null>>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authStoreMock = {
      user: signal<User | null>({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        phoneNumber: '',
        firstName: 'Test',
        middleName: '',
        lastName: 'User'
      }),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), { provide: AuthStoreService, useValue: authStoreMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
  });

  it('shows a logout button in the profile submenu', () => {
    const profileMenu = fixture.nativeElement.querySelector('details');
    profileMenu.open = true;
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('[data-testid="logout-button"]');

    expect(logoutButton?.textContent.trim()).toBe('Cerrar sesión');
  });

  it('logs out when the submenu button is clicked', () => {
    const profileMenu = fixture.nativeElement.querySelector('details');
    profileMenu.open = true;
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('[data-testid="logout-button"]') as HTMLButtonElement;
    logoutButton.click();

    expect(authStoreMock.logout).toHaveBeenCalledOnce();
  });
});
