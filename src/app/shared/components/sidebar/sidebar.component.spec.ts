import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { signal } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authStoreMock: any;

  beforeEach(async () => {
    authStoreMock = {
      user: signal({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: 'https://example.com/avatar.jpg'
      }),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStoreService, useValue: authStoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collapse state', () => {
    expect(component.isCollapsed()).toBeFalsy();
    component.toggleCollapse();
    expect(component.isCollapsed()).toBeTruthy();
    component.toggleCollapse();
    expect(component.isCollapsed()).toBeFalsy();
  });

  it('should compute full user name correctly', () => {
    expect(component.userName()).toBe('Test User');
  });

  it('should return username or email if names are missing', () => {
    authStoreMock.user.set({ id: '1', username: 'johndoe', email: 'john@example.com' });
    expect(component.userName()).toBe('johndoe');

    authStoreMock.user.set({ id: '1', email: 'john@example.com' });
    expect(component.userName()).toBe('john@example.com');
  });

  it('should call authStore.logout when logout is called', () => {
    component.logout();
    expect(authStoreMock.logout).toHaveBeenCalled();
  });
});
