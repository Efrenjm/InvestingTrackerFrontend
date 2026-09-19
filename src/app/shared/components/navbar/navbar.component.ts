import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStoreService } from '../../../core/services/auth-store.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex items-center justify-between px-10 py-6 bg-[#f6f7f5]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-[#094c42] rounded-lg"></div>
        <span class="text-[22px] font-black text-[#1c1c1c]">EduFinances</span>
      </div>

      <div class="flex items-center gap-8 text-[14px] font-medium text-[#6b7280]">
        <a routerLink="/dashboard" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Inicio</a>
        <a routerLink="/accounts" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Cuentas</a>
        <a routerLink="/budgets" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Presupuestos</a>
        <a routerLink="/reports" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Informes</a>
      </div>

      <div class="flex items-center gap-4">
        <div class="bg-white rounded-full p-2 shadow-sm border border-gray-100">
           <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" /></svg>
        </div>
        <details class="relative border-l pl-4 border-gray-200">
          <summary class="flex items-center gap-3 cursor-pointer list-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#094c42]">
            <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img [src]="user()?.avatarUrl || 'assets/default-avatar.png'" alt="User profile">
            </div>
            <div class="flex flex-col text-left">
              <span class="text-[14px] font-semibold text-[#1c1c1c] leading-tight">{{ user()?.firstName }}</span>
              <span class="text-[14px] font-semibold text-[#1c1c1c] leading-tight">{{ user()?.lastName }}</span>
            </div>
          </summary>
          <div class="absolute right-0 top-full z-10 mt-2 min-w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
            <button
              type="button"
              data-testid="logout-button"
              class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              (click)="logout()"
            >
              Log out
            </button>
          </div>
        </details>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly authStore = inject(AuthStoreService);
  user = this.authStore.user;

  logout() {
    this.authStore.logout();
  }
}
