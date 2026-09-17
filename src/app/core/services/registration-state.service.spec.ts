import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RegistrationStateService } from './registration-state.service';

describe('RegistrationStateService', () => {
  let service: RegistrationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should initialize empty without browser storage', () => {
    service = TestBed.inject(RegistrationStateService);

    expect(service.userId()).toBeNull();
    expect(service.username()).toBeNull();
    expect(service.hasActiveRegistration()).toBe(false);
  });

  describe('setRegistrationData', () => {
    beforeEach(() => {
      service = TestBed.inject(RegistrationStateService);
    });

    it('should keep only provisional registration identity in application state', () => {
      service.setRegistrationData('user1', 'johndoe@example.com');
      
      expect(service.userId()).toBe('user1');
      expect(service.username()).toBe('johndoe@example.com');
      expect(service.hasActiveRegistration()).toBe(true);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      service = TestBed.inject(RegistrationStateService);
    });

    it('should clear provisional registration state', () => {
      service.setRegistrationData('user1', 'johndoe@example.com');
      service.clear();
      
      expect(service.userId()).toBeNull();
      expect(service.username()).toBeNull();
      expect(service.hasActiveRegistration()).toBe(false);
    });
  });

  it('should keep the verified username available once without creating a session', () => {
    service = TestBed.inject(RegistrationStateService);
    service.setRegistrationData('user1', 'johndoe@example.com');

    service.completeVerification();

    expect(service.hasActiveRegistration()).toBe(false);
    expect(service.consumeVerifiedUsername()).toBe('johndoe@example.com');
    expect(service.consumeVerifiedUsername()).toBeNull();
  });

  describe('maskedUsername', () => {
    beforeEach(() => {
      service = TestBed.inject(RegistrationStateService);
    });

    it('should mask a short email address correctly', () => {
      service.setRegistrationData('1', 'a@domain.com');
      expect(service.maskedUsername()).toBe('a***@domain.com');

      service.setRegistrationData('1', 'ab@domain.com');
      expect(service.maskedUsername()).toBe('a***@domain.com');
    });

    it('should mask a longer email address correctly', () => {
      service.setRegistrationData('1', 'abcde@domain.com');
      expect(service.maskedUsername()).toBe('ab***@domain.com');
    });

    it('should mask a phone number correctly', () => {
      service.setRegistrationData('1', '1234567890');
      expect(service.maskedUsername()).toBe('123***890');
    });

    it('should not mask short non-email strings', () => {
      service.setRegistrationData('1', '1234');
      expect(service.maskedUsername()).toBe('1234');
    });

    it('should return empty string if no username', () => {
      expect(service.maskedUsername()).toBe('');
    });
  });
});
