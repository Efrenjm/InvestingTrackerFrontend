import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-input',
  imports: [CommonModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent implements AfterViewInit {
  readonly length = input(6);
  readonly hasError = input(false);
  readonly disabled = input(false);
  readonly codeComplete = output<string>();

  readonly digits = signal<string[]>(['', '', '', '', '', '']);
  readonly focusedIndex = signal<number>(-1);

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  ngAfterViewInit() {
    // Auto-focus first input
    setTimeout(() => this.focusInput(0), 100);
  }

  onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase(); // Backend accepts A-Z0-9
    
    // Only allow alphanumeric
    value = value.replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 1) {
      // Handle multi-character input (e.g., autocomplete)
      value = value[0];
    }

    const newDigits = [...this.digits()];
    newDigits[index] = value;
    this.digits.set(newDigits);
    input.value = value;

    if (value && index < this.length() - 1) {
      this.focusInput(index + 1);
    }

    this.checkComplete();
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      const currentDigits = this.digits();
      if (!currentDigits[index] && index > 0) {
        // Current is empty, go back to previous
        event.preventDefault();
        const newDigits = [...currentDigits];
        newDigits[index - 1] = '';
        this.digits.set(newDigits);
        this.focusInput(index - 1);
      } else {
        // Clear current
        const newDigits = [...currentDigits];
        newDigits[index] = '';
        this.digits.set(newDigits);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text')?.toUpperCase().replace(/[^A-Z0-9]/g, '') || '';
    
    if (pasteData.length === 0) return;

    const newDigits = [...this.digits()];
    for (let i = 0; i < Math.min(pasteData.length, this.length()); i++) {
      newDigits[i] = pasteData[i];
    }
    this.digits.set(newDigits);

    // Focus the next empty input or the last one
    const nextEmpty = newDigits.findIndex(d => !d);
    this.focusInput(nextEmpty >= 0 ? nextEmpty : this.length() - 1);

    // Update all input element values
    setTimeout(() => {
      this.digitInputs.forEach((input, i) => {
        input.nativeElement.value = newDigits[i];
      });
    });

    this.checkComplete();
  }

  onFocus(index: number) {
    this.focusedIndex.set(index);
    // Select the content of the focused input
    const input = this.digitInputs?.get(index)?.nativeElement;
    if (input) input.select();
  }

  onBlur() {
    this.focusedIndex.set(-1);
  }

  reset() {
    this.digits.set(Array(this.length()).fill(''));
    this.digitInputs?.forEach(input => {
      input.nativeElement.value = '';
    });
    setTimeout(() => this.focusInput(0), 50);
  }

  private focusInput(index: number) {
    const input = this.digitInputs?.get(index)?.nativeElement;
    if (input) input.focus();
  }

  private checkComplete() {
    const code = this.digits().join('');
    if (code.length === this.length() && code.split('').every(d => d !== '')) {
      this.codeComplete.emit(code);
    }
  }
}
