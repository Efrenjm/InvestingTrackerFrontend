import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegistrationStateService {
  private readonly _userId = signal<string | null>(null);
  private readonly _username = signal<string | null>(null);
  private _password: string | null = null; // In memory only - never persisted

  readonly userId = this._userId.asReadonly();
  readonly username = this._username.asReadonly();

  readonly hasActiveRegistration = computed(() => !!this._userId() && !!this._username());

  readonly maskedUsername = computed(() => {
    const username = this._username();
    if (!username) return '';

    if (username.includes('@')) {
      const [local, domain] = username.split('@');
      if (local.length <= 2) return `${local[0]}***@${domain}`;
      return `${local[0]}${local[1]}***@${domain}`;
    }

    // Phone number masking
    if (username.length > 4) {
      return `${username.substring(0, 3)}***${username.substring(username.length - 3)}`;
    }
    return username;
  });

  constructor() {
    // Restore from sessionStorage on init (survives page refresh)
    const userId = sessionStorage.getItem('pending_user_id');
    const username = sessionStorage.getItem('pending_username');
    if (userId && username) {
      this._userId.set(userId);
      this._username.set(username);
    }
  }

  setRegistrationData(userId: string, username: string, password: string) {
    this._userId.set(userId);
    this._username.set(username);
    this._password = password; // Memory only
    sessionStorage.setItem('pending_user_id', userId);
    sessionStorage.setItem('pending_username', username);
  }

  getPasswordForAutoLogin(): string | null {
    return this._password;
  }

  clear() {
    this._userId.set(null);
    this._username.set(null);
    this._password = null;
    sessionStorage.removeItem('pending_user_id');
    sessionStorage.removeItem('pending_username');
  }
}
