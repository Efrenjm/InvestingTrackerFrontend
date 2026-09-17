import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegistrationStateService {
  private readonly _userId = signal<string | null>(null);
  private readonly _username = signal<string | null>(null);
  private readonly _verifiedUsername = signal<string | null>(null);

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

  setRegistrationData(userId: string, username: string) {
    this._userId.set(userId);
    this._username.set(username);
  }

  completeVerification() {
    this._verifiedUsername.set(this._username());
    this._userId.set(null);
    this._username.set(null);
  }

  consumeVerifiedUsername(): string | null {
    const username = this._verifiedUsername();
    this._verifiedUsername.set(null);
    return username;
  }

  clear() {
    this._userId.set(null);
    this._username.set(null);
    this._verifiedUsername.set(null);
  }
}
