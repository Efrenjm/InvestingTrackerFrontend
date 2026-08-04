import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AvatarComponent],
  template: `
    <aside
      class="h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm"
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()"
    >
      <!-- Logo / Header -->
      <div class="h-16 flex items-center px-4 border-b border-gray-100">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="bg-primary-600 rounded-lg p-2 flex-shrink-0">
             <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          @if (!isCollapsed()) {
            <span class="font-bold text-lg text-gray-900 whitespace-nowrap">Investing Tracker</span>
          }
        </div>
      </div>

      <!-- User Profile Section -->
      <div
        class="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        routerLink="/profile"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <app-avatar
            [imageUrl]="user()?.avatarUrl"
            [name]="userName()"
            [size]="isCollapsed() ? 48 : 40"
            class="flex-shrink-0"
          ></app-avatar>
          @if (!isCollapsed()) {
            <div class="flex flex-col min-w-0">
              <span class="font-medium text-gray-900 truncate">{{ userName() }}</span>
              <span class="text-xs text-gray-500 truncate">{{ user()?.email }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-primary-50 text-primary-700"
          class="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all group"
          [title]="isCollapsed() ? 'Dashboard' : ''"
        >
          <svg class="w-6 h-6 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          @if (!isCollapsed()) {
            <span class="font-medium">Dashboard</span>
          }
        </a>

        <a
          routerLink="/wallets"
          routerLinkActive="bg-primary-50 text-primary-700"
          class="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all group"
          [title]="isCollapsed() ? 'Billeteras' : ''"
        >
          <svg class="w-6 h-6 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          @if (!isCollapsed()) {
            <span class="font-medium">Billeteras</span>
          }
        </a>

        <a
          routerLink="/profile"
          routerLinkActive="bg-primary-50 text-primary-700"
          class="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all group"
          [title]="isCollapsed() ? 'Profile' : ''"
        >
          <svg class="w-6 h-6 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          @if (!isCollapsed()) {
            <span class="font-medium">Profile</span>
          }
        </a>
      </nav>

      <!-- Footer / Toggle -->
      <div class="p-4 border-t border-gray-100 space-y-2">
        <button
          (click)="logout()"
          class="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
          [title]="isCollapsed() ? 'Logout' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          @if (!isCollapsed()) {
            <span class="font-medium">Logout</span>
          }
        </button>

        <button
          (click)="toggleCollapse()"
          class="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          <svg
            class="w-6 h-6 transition-transform duration-300"
            [class.rotate-180]="isCollapsed()"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStoreService);

  isCollapsed = signal<boolean>(false);
  user = this.authStore.user;

  userName = computed(() => {
    const u = this.user();
    if (!u) return '';
    if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`;
    return u.username || u.email;
  });

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  logout() {
    this.authStore.logout();
  }
}
