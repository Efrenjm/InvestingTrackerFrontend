import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { PasswordFieldsComponent } from './password-fields.component';

describe('PasswordFieldsComponent', () => {
  async function createComponent(password = '', confirmation = '') {
    await TestBed.configureTestingModule({
      imports: [PasswordFieldsComponent, ReactiveFormsModule],
    }).compileComponents();

    const fixture: ComponentFixture<PasswordFieldsComponent> = TestBed.createComponent(PasswordFieldsComponent);
    fixture.componentRef.setInput('passwordControl', new FormControl(password));
    fixture.componentRef.setInput('confirmPasswordControl', new FormControl(confirmation));
    fixture.detectChanges();
    return fixture;
  }

  it('renders the strength meter and all password requirements', async () => {
    const fixture = await createComponent('Password123!');

    expect(fixture.nativeElement.querySelector('[role="progressbar"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('[data-password-requirement]').length).toBe(5);
  });

  it('shows a mismatch message after confirmation is touched', async () => {
    const fixture = await createComponent('Password123!', 'Different123!');
    const confirmPasswordControl = fixture.componentInstance.confirmPasswordControl();
    const inputs = fixture.nativeElement.querySelectorAll('input');
    inputs[1].dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.passwordsMatch()).toBe(false);
    expect(confirmPasswordControl.touched).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Passwords do not match');
  });
});
