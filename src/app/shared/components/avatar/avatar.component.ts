import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  template: `
    <div
      [class]="containerClass()"
      [style.width.px]="size()"
      [style.height.px]="size()"
    >
      @if (imageUrl()) {
        <img
          [src]="imageUrl()"
          [alt]="name()"
          class="h-full w-full object-cover"
        />
      } @else {
        <span [class]="textClass()">{{ initials() }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  imageUrl = input<string | undefined>();
  name = input<string>('');
  size = input<number>(40);

  initials = computed(() => {
    const names = this.name().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return (this.name()[0] || '').toUpperCase();
  });

  containerClass = computed(() => {
    return `flex items-center justify-center rounded-full overflow-hidden bg-primary-100 text-primary-700 font-medium border border-primary-200`;
  });

  textClass = computed(() => {
    const size = this.size();
    if (size < 32) return 'text-xs';
    if (size < 48) return 'text-sm';
    if (size < 64) return 'text-base';
    return 'text-lg';
  });
}
