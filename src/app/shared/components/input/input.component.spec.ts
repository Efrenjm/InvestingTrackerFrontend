import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
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
    const control = new FormControl('', { validators: (c) => ({ required: true }) });
    fixture.componentRef.setInput('control', control);
    control.markAsTouched();
    fixture.detectChanges();
    
    expect(component.error()).toBe('This field is required');
  });
});
