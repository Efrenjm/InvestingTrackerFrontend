import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-[#fbf9f6] flex flex-col font-sans">
      <app-navbar></app-navbar>
      <main class="flex-1 p-4 md:p-8">
        <div class="max-w-7xl mx-auto bg-[#f6f7f5] rounded-[32px] p-8 shadow-[0px_20px_40px_0px_rgba(0,0,0,0.04)] min-h-[85vh]">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {}
