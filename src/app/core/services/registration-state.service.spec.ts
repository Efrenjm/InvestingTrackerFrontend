import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RegistrationStateService } from './registration-state.service';

describe('RegistrationStateService', () => {
  let service: RegistrationStateService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should restore from sessionStorage on init', () => {
    sessionStorage.setItem('pending_user_id', 'user123');
    sessionStorage.setItem('pending_username', 'test@example.com');
    
    service = TestBed.inject(RegistrationStateService);

    expect(service.userId()).toBe('user123');
    expect(service.username()).toBe('test@example.com');
    expect(service.hasActiveRegistration()).toBe(true);
  });

  it('should initialize empty if no sessionStorage data', () => {
    service = TestBed.inject(RegistrationStateService);

    expect(service.userId()).toBeNull();
    expect(service.username()).toBeNull();
    expect(service.hasActiveRegistration()).toBe(false);
  });

  describe('setRegistrationData', () => {
    beforeEach(() => {
      service = TestBed.inject(RegistrationStateService);
    });

    it('should set data and store in sessionStorage', () => {
      service.setRegistrationData('user1', 'johndoe@example.com', 'password123');
      
      expect(service.userId()).toBe('user1');
      expect(service.username()).toBe('johndoe@example.com');
      expect(service.getPasswordForAutoLogin()).toBe('password123');
      
      expect(sessionStorage.getItem('pending_user_id')).toBe('user1');
      expect(sessionStorage.getItem('pending_username')).toBe('johndoe@example.com');
      expect(service.hasActiveRegistration()).toBe(true);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      service = TestBed.inject(RegistrationStateService);
    });

    it('should clear data and remove from sessionStorage', () => {
      service.setRegistrationData('user1', 'johndoe@example.com', 'password123');
      service.clear();
      
      expect(service.userId()).toBeNull();
      expect(service.username()).toBeNull();
      expect(service.getPasswordForAutoLogin()).toBeNull();
      
      expect(sessionStorage.getItem('pending_user_id')).toBeNull();
      expect(sessionStorage.getItem('pending_username')).toBeNull();
      expect(service.hasActiveRegistration()).toBe(false);
    });
  });

  describe('maskedUsername', () => {
    beforeEach(() => {
      service = TestBed.inject(RegistrationStateService);
    });

    it('should mask a short email address correctly', () => {
      service.setRegistrationData('1', 'a@domain.com', 'pass');
      expect(service.maskedUsername()).toBe('a***@domain.com');

      service.setRegistrationData('1', 'ab@domain.com', 'pass');
      expect(service.maskedUsername()).toBe('a***@domain.com');
    });

    it('should mask a longer email address correctly', () => {
      service.setRegistrationData('1', 'abcde@domain.com', 'pass');
      expect(service.maskedUsername()).toBe('ab***@domain.com');
    });

    it('should mask a phone number correctly', () => {
      service.setRegistrationData('1', '1234567890', 'pass');
      expect(service.maskedUsername()).toBe('123***890');
    });

    it('should not mask short non-email strings', () => {
      service.setRegistrationData('1', '1234', 'pass');
      expect(service.maskedUsername()).toBe('1234');
    });

    it('should return empty string if no username', () => {
      expect(service.maskedUsername()).toBe('');
    });
  });
});
