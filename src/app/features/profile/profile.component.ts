import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { UserService } from '../../core/services/user-http.service';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../core/services/notification.service';
import { PasswordFieldsComponent } from '../../shared/components/password-fields/password-fields.component';

type ProfileSection = 'general' | 'security';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, AvatarComponent, PasswordFieldsComponent, MatSnackBarModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p class="text-gray-500 mt-1">Manage your profile information and security preferences.</p>
      </header>

      <!-- Section Selector -->
      <div class="flex border-b border-gray-200">
        <button
          (click)="activeSection.set('general')"
          class="px-6 py-3 text-sm font-medium transition-colors relative"
          [class.text-primary-600]="activeSection() === 'general'"
          [class.text-gray-500]="activeSection() !== 'general'"
        >
          General Information
          @if (activeSection() === 'general') {
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
          }
        </button>
        <button
          (click)="activeSection.set('security')"
          class="px-6 py-3 text-sm font-medium transition-colors relative"
          [class.text-primary-600]="activeSection() === 'security'"
          [class.text-gray-500]="activeSection() !== 'security'"
        >
          Security & Password
          @if (activeSection() === 'security') {
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
          }
        </button>
      </div>

      <!-- General Section -->
      @if (activeSection() === 'general') {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-8 space-y-8">
            <div class="flex items-center gap-6">
              <app-avatar
                [imageUrl]="$safeNavigationMigration(user()?.avatarUrl)"
                [name]="userName()"
                [size]="80"
              ></app-avatar>
              <div>
                <h3 class="font-medium text-gray-900">Profile Picture</h3>
                <p class="text-sm text-gray-500">
                  Update your avatar. This will be visible to other users.
                </p>
                <!-- URL input for simplicity in this prototype -->
                <div class="mt-4 flex gap-4">
                  <app-input
                    label="Avatar URL"
                    [formGroup]="profileForm"
                    controlName="profilePicture"
                    placeholder="https://example.com/avatar.jpg"
                    class="flex-1"
                  ></app-input>
                </div>
              </div>
            </div>

            <form
              [formGroup]="profileForm"
              (ngSubmit)="updateProfile()"
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <app-input
                label="Username"
                [formGroup]="profileForm"
                controlName="username"
                placeholder="johndoe"
              ></app-input>
              <app-input
                label="First Name"
                [formGroup]="profileForm"
                controlName="firstName"
                placeholder="John"
              ></app-input>
              <app-input
                label="Middle Name"
                [formGroup]="profileForm"
                controlName="middleName"
                placeholder="Quincy"
              ></app-input>
              <app-input
                label="Last Name"
                [formGroup]="profileForm"
                controlName="lastName"
                placeholder="Doe"
              ></app-input>

              <div class="md:col-span-2 flex justify-end pt-4 border-t border-gray-50">
                <app-button type="submit" [disabled]="profileForm.invalid || loading()">
                  Save Changes
                </app-button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Security Section -->
      @if (activeSection() === 'security') {
        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
            <form
              [formGroup]="passwordForm"
              (ngSubmit)="updatePassword()"
              class="space-y-6 max-w-md"
            >
              <app-input
                label="Current Password"
                type="password"
                [formGroup]="passwordForm"
                controlName="oldPassword"
                placeholder="••••••••"
              ></app-input>
              <app-password-fields
                [passwordControl]="passwordForm.controls.newPassword"
                [confirmPasswordControl]="passwordForm.controls.confirmPassword"
                passwordLabel="New Password"
                confirmPasswordLabel="Confirm New Password"
                passwordPlaceholder="••••••••"
                confirmPasswordPlaceholder="••••••••"
              ></app-password-fields>

              <div class="flex justify-end pt-4">
                <app-button type="submit" [disabled]="passwordForm.invalid || loading()">
                  Update Password
                </app-button>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
            <p class="text-sm text-gray-500 mb-6">Verify and update your email and phone number.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <app-input
                  label="Email Address"
                  [formGroup]="contactForm"
                  controlName="email"
                ></app-input>
                <app-button variant="outline" size="sm" (click)="initEmailUpdate()">
                  Change Email
                </app-button>
              </div>
              <div class="space-y-4">
                <app-input
                  label="Phone Number"
                  [formGroup]="contactForm"
                  controlName="phoneNumber"
                ></app-input>
                <app-button variant="outline" size="sm" (click)="initPhoneUpdate()">
                  Change Phone
                </app-button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStoreService);
  private readonly userService = inject(UserService);
  private readonly authHttp = inject(AuthHttpService);

  activeSection = signal<ProfileSection>('general');
  loading = signal<boolean>(false);
  user = this.authStore.user;

  userName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.firstName} ${u.lastName}`;
  });

  profileForm = this.fb.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    profilePicture: [''],
  });

  passwordForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?])(?=\\S+$).{8,}$'),
      ]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  contactForm = this.fb.group({
    email: [{ value: '', disabled: true }],
    phoneNumber: [{ value: '', disabled: true }],
  });

  constructor() {
    this.loadUserData();
  }

  private loadUserData() {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        username: u.username,
        firstName: u.firstName,
        middleName: u.middleName,
        lastName: u.lastName,
        profilePicture: u.avatarUrl ?? '',
      });
      this.contactForm.patchValue({
        email: u.email,
        phoneNumber: u.phoneNumber,
      });
    }
  }

  private passwordMatchValidator(this: void, g: AbstractControl) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.loading.set(true);
    this.userService.updateProfile(this.profileForm.getRawValue()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedUser) => {
        this.authStore.updateUser({
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          middleName: updatedUser.middleName,
          lastName: updatedUser.lastName,
          avatarUrl: updatedUser.avatarUrl,
        });
        this.loading.set(false);
        this.notifications.success('Profile updated successfully!');
      },
      error: () => this.loading.set(false),
    });
  }

  updatePassword() {
    if (this.passwordForm.invalid) return;

    this.loading.set(true);
    const { oldPassword, newPassword } = this.passwordForm.getRawValue();
    this.authHttp.updatePassword({ oldPassword, newPassword }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.passwordForm.reset();
        this.notifications.success('Password updated successfully!');
      },
      error: () => this.loading.set(false),
    });
  }

  initEmailUpdate() {
    this.notifications.info('Email update flow initiated. Please check your current email for verification.');
  }

  initPhoneUpdate() {
    this.notifications.info('Phone update flow initiated. Please check your phone for verification.');
  }
}
