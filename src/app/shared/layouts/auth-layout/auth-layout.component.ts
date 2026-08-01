import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [CommonModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  readonly title = input('Welcome');
  readonly subtitle = input('Manage your investments with intelligence');
  readonly step = input<number | undefined>(undefined);
  readonly totalSteps = input(2);
  readonly stepLabels = input<string[]>(['Create Account', 'Verify Code']);
}
