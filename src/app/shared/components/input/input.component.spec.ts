import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
      providers: [provideAnimationsAsync()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when control is invalid and touched', () => {
    const control = new FormControl('', { validators: (_c) => ({ required: true }) });
    fixture.componentRef.setInput('control', control);
    control.markAsTouched();
    fixture.detectChanges();
    
    expect(component.errorMessage).toBe('This field is required');
  });

  it('should not show an error when the invalid control changes before blur', () => {
    const control = new FormControl('', { validators: (_c) => ({ required: true }) });
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    control.setValue('still invalid');
    control.setValue('');
    fixture.detectChanges();

    expect(component.errorMessage).toBe('');
  });

  it('should update the error after blur when the control changes', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    control.markAsTouched();
    control.setValue('valid value');
    fixture.detectChanges();

    expect(component.errorMessage).toBe('');

    control.setValue('');
    fixture.detectChanges();

    expect(component.errorMessage).toBe('This field is required');
  });

  it('should hide validation errors when error display is disabled', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('showErrors', false);
    control.markAsTouched();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('');
  });

  it('should show a red required marker for controls with the required validator', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();

    const requiredMarker = fixture.nativeElement.querySelector('[aria-label="required"]');

    expect(requiredMarker?.textContent.trim()).toBe('*');
  });

  it('should keep the focus ring rounded like the input', () => {
    const control = new FormControl('value');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const focusContainer = fixture.nativeElement.querySelector('.relative');
    expect(focusContainer.classList.contains('rounded-xl')).toBe(true);
  });
});
