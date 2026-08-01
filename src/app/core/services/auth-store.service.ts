import { Injectable, computed, inject, signal } from '@angular/core';
import { User, AuthResponse } from '../models/auth.models';
import { AuthHttpService } from './auth-http.service';
import { IndexedDbService } from './indexed-db.service';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private readonly authHttp = inject(AuthHttpService);
  private readonly db = inject(IndexedDbService);

  private readonly _user = signal<User | null>(null);
  private readonly _loading = signal<boolean>(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly loading = this._loading.asReadonly();

  constructor() {
    this.initializeSession();
  }

  private async initializeSession() {
    this._loading.set(true);

    const cachedUser = await this.db.getItem<User>('user_metadata', 'current_user');
    if (cachedUser) {
      this._user.set(cachedUser);
    }

    this.authHttp.getCurrentUser().pipe(
      tap(res => {
        if (res.user) {
          this.setAuthenticatedUser(res.user);
        } else {
          this.clearSession();
        }
        this._loading.set(false);
      }),
      catchError(() => {
        this.clearSession();
        this._loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  fetchUser() {
    this._loading.set(true);
    return this.authHttp.getCurrentUser().pipe(
      tap(res => {
        if (res.user) {
          this.setAuthenticatedUser(res.user);
        } else {
          this.clearSession();
        }
        this._loading.set(false);
      }),
      catchError((err) => {
        this.clearSession();
        this._loading.set(false);
        throw err;
      })
    );
  }

  setAuthenticatedUser(user: User) {
    this._user.set(user);
    this.db.setItem('user_metadata', 'current_user', user);
  }

  updateUser(user: Partial<User>) {
    const currentUser = this._user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user };
      this.setAuthenticatedUser(updatedUser);
    }
  }

  async clearSession() {
    this._user.set(null);
    await this.db.removeItem('user_metadata', 'current_user');
  }

  logout() {
    this.authHttp.logout().subscribe(() => {
      this.clearSession();
    });
  }
}
