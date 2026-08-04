import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpInputComponent } from './otp-input.component';
import { By } from '@angular/platform-browser';

describe('OtpInputComponent', () => {
  let component: OtpInputComponent;
  let fixture: ComponentFixture<OtpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render 6 input boxes by default', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBe(6);
  });

  it('should transform lowercase to uppercase and only keep alphanumeric', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const firstInput = inputs[0].nativeElement as HTMLInputElement;
    
    firstInput.value = 'a';
    component.onInput(0, { target: firstInput } as any);
    
    expect(component.digits()[0]).toBe('A');
    expect(firstInput.value).toBe('A');

    firstInput.value = '@';
    component.onInput(0, { target: firstInput } as any);
    expect(component.digits()[0]).toBe('');
  });

  it('should emit codeComplete when all 6 digits are filled', () => {
    const spy = vi.spyOn(component.codeComplete, 'emit');
    
    component.digits.set(['1', '2', '3', '4', '5', '']);
    
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const lastInput = inputs[5].nativeElement as HTMLInputElement;
    lastInput.value = '6';
    
    component.onInput(5, { target: lastInput } as any);
    
    expect(spy).toHaveBeenCalledWith('123456');
  });

  it('should handle backspace navigation', () => {
    component.digits.set(['1', '2', '', '', '', '']);
    fixture.detectChanges();
    
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const spyFocus1 = vi.spyOn(inputs[1].nativeElement, 'focus');

    const event = new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true });
    const spyPrevent = vi.spyOn(event, 'preventDefault');
    component.onKeyDown(2, event as KeyboardEvent);

    expect(spyPrevent).toHaveBeenCalled();
    expect(component.digits()[1]).toBe('');
    expect(spyFocus1).toHaveBeenCalled();
  });

  it('should handle paste event with multi-digit code', () => {
    vi.useFakeTimers();
    const spyEmit = vi.spyOn(component.codeComplete, 'emit');
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const spyFocus5 = vi.spyOn(inputs[5].nativeElement, 'focus');
    
    const pasteEvent = {
      preventDefault: vi.fn(),
      clipboardData: {
        getData: (type: string) => 'a1b2c3d4'
      }
    } as unknown as ClipboardEvent;
    
    component.onPaste(pasteEvent);
    
    expect(component.digits()).toEqual(['A', '1', 'B', '2', 'C', '3']);
    
    vi.advanceTimersByTime(50);
    
    expect(spyFocus5).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith('A1B2C3');
    vi.useRealTimers();
  });
});
