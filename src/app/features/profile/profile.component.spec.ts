import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { UserService } from '../../core/services/user-http.service';
import { AuthHttpService } from '../../core/services/auth-http.service';
import type { User } from '../../core/models/auth.models';

describe('ProfileComponent request lifecycle', () => {
  it('cancels pending profile and password updates when destroyed', () => {
    const profileResponse = new Subject<User>();
    const passwordResponse = new Subject<void>();
    const updateProfile = vi.fn(() => profileResponse);
    const updatePassword = vi.fn(() => passwordResponse);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStoreService, useValue: { user: signal(null), updateUser: vi.fn() } },
        { provide: UserService, useValue: { updateProfile } },
        { provide: AuthHttpService, useValue: { updatePassword } },
      ],
    });
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    component.profileForm.setValue({ username: 'sample', firstName: 'Sample', middleName: '', lastName: 'User', profilePicture: '' });
    component.passwordForm.setValue({ oldPassword: 'synthetic-old', newPassword: 'synthetic-new', confirmPassword: 'synthetic-new' });
    component.updateProfile();
    component.updatePassword();
    expect(updateProfile).toHaveBeenCalledWith(component.profileForm.getRawValue());
    expect(updatePassword).toHaveBeenCalledWith({ oldPassword: 'synthetic-old', newPassword: 'synthetic-new' });
    expect(profileResponse.observed).toBe(true);
    expect(passwordResponse.observed).toBe(true);
    fixture.destroy();
    expect(profileResponse.observed).toBe(false);
    expect(passwordResponse.observed).toBe(false);
  });
});
