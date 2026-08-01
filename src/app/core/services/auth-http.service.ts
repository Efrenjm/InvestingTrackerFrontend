import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, VerifyCodeRequest, User } from '../models/auth.models';
import { UpdatePasswordRequest } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, {
      username: data.email,
      password: data.password
    });
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data);
  }

  verifyCode(data: VerifyCodeRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/verify-code`, data);
  }

  refreshCode(userId: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/auth/refresh-code?userId=${userId}`);
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/user`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }

  updatePassword(data: UpdatePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/auth/password`, data);
  }

  updateEmail(newEmail: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/auth/email`, newEmail);
  }

  updatePhone(newPhone: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/auth/phone`, newPhone);
  }
}
