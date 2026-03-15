import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo / Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">{{ title }}</h1>
          <p class="text-slate-500 mt-2">{{ subtitle }}</p>
        </div>

        <!-- Card Content -->
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-slate-400 text-sm">© 2026 InvestingTracker. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .bg-primary { background-color: #3f51b5; } /* Material Indigo 500 fallback */
  `]
})
export class AuthLayoutComponent {
  @Input() title = 'Bienvenido';
  @Input() subtitle = 'Gestiona tus inversiones con inteligencia';
}
