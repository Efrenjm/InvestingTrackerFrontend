import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show initials when no image is provided', () => {
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();
    
    const initialsElement = fixture.nativeElement.querySelector('span');
    expect(initialsElement.textContent).toBe('JD');
  });

  it('should show single initial for single name', () => {
    fixture.componentRef.setInput('name', 'John');
    fixture.detectChanges();
    
    const initialsElement = fixture.nativeElement.querySelector('span');
    expect(initialsElement.textContent).toBe('J');
  });

  it('should show image when imageUrl is provided', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/avatar.jpg');
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();
    
    const imgElement = fixture.nativeElement.querySelector('img');
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toBe('https://example.com/avatar.jpg');
    expect(imgElement.alt).toBe('John Doe');
  });
});
